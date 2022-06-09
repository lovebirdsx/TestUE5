/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import {
    Actor,
    BuiltinString,
    EditorAssetLibrary,
    EditorLevelLibrary,
    EditorOperations,
    EDrawDebugTrace,
    ETraceTypeQuery,
    HitResult,
    KismetSystemLibrary,
    NewArray,
    Rotator,
    Transform,
    Vector,
} from 'ue';

import { ITransform, toRotation, toTransform, toVector } from '../../Common/Interface';
import { error, log } from '../../Common/Log';
import { toUeArray } from '../../Common/UeHelper';
import { deepEquals, getAssetPath } from '../../Common/Util';
import { LevelUtil } from '../../Game/Common/LevelUtil';
import { EntityTemplateOp } from '../../Game/Common/Operations/EntityTemplate';
import { isEntity } from '../../Game/Entity/Common';
import { ITsEntity } from '../../Game/Interface';
import { TComponentType } from '../../Game/Interface/Component';
import { getClassByBluprintType } from '../../Game/Interface/Entity';
import { levelDataManager } from './LevelDataManager';
import { entityRegistry } from './Scheme/Entity';

class LevelEditorUtil {
    public static SelectActor(actor: Actor): boolean {
        if (!actor) {
            EditorLevelLibrary.ClearActorSelectionSet();
            return false;
        }
        const actors = NewArray(Actor);
        actors.Add(actor);
        EditorLevelLibrary.SetSelectedLevelActors(actors);
        return true;
    }

    public static ClearSelect(): void {
        EditorLevelLibrary.ClearActorSelectionSet();
    }

    public static IsSelect(actor: Actor): boolean {
        const actors = EditorLevelLibrary.GetSelectedLevelActors();
        for (let i = 0; i < actors.Num(); i++) {
            const actor1 = actors.Get(i);
            if (actor1 === actor) {
                return true;
            }
        }
        return false;
    }

    public static FocusSelected(): void {
        EditorOperations.ExecuteLevelEditorCommand('CAMERA ALIGN');
    }

    public static Focus(actor: Actor): void {
        if (this.SelectActor(actor)) {
            this.FocusSelected();
        }
    }

    public static FocusOnSelectedBlueprint(actor: Actor): void {
        const path = getAssetPath(actor.GetClass());
        EditorAssetLibrary.SyncBrowserToObjects(toUeArray([path], BuiltinString));
    }

    public static get IsPlaying(): boolean {
        return EditorOperations.GetEditorEngine().PlayWorld !== undefined;
    }

    public static GetAllEntitiesByEditorWorld(): ITsEntity[] {
        const world = EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            error('No editor world exist');
            return [];
        }

        return LevelUtil.GetAllEntities(world);
    }

    public static GetEntity(id: number): ITsEntity {
        const entities = this.GetAllEntitiesByEditorWorld();
        return entities.find((entity) => entity.Id === id);
    }

    public static GetEntityComponentData<T>(entity: ITsEntity, componentType: TComponentType): T {
        const data = levelDataManager.GetEntityData(entity);
        return data.ComponentsData[componentType] as T;
    }

    public static GetSelectedEntity(): ITsEntity {
        const actors = EditorLevelLibrary.GetSelectedLevelActors();

        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            if (isEntity(actor)) {
                return actor as ITsEntity;
            }
        }

        return undefined;
    }

    public static CheckAndSaveEntityData(entity: ITsEntity, isForce?: boolean): void {
        if (!isForce && !EditorOperations.IsActorDirty(entity)) {
            return;
        }

        const currentData = entityRegistry.GenData(entity);
        const savedData = levelDataManager.GetEntityData(entity);
        if (!deepEquals(currentData, savedData)) {
            levelDataManager.ModifyEntityData(entity, currentData);
        }
    }

    public static CheckAndSaveAllEntityData(): void {
        const entities = this.GetAllEntitiesByEditorWorld();
        entities.forEach((entity) => {
            this.CheckAndSaveEntityData(entity, true);
        });
    }

    public static SaveEntityData(entity: ITsEntity): void {
        const currentData = entityRegistry.GenData(entity);
        levelDataManager.ModifyEntityData(entity, currentData);
    }

    public static SaveAllEntityData(): void {
        const entities = this.GetAllEntitiesByEditorWorld();
        entities.forEach((entity) => {
            this.SaveEntityData(entity);
        });
    }

    public static CheckEntity(entity: ITsEntity): number {
        const entityData = entityRegistry.GenData(entity);
        const messages: string[] = [];
        if (entityRegistry.Check(entityData, entity, messages) > 0) {
            messages.forEach((msg) => {
                error(`[${entity.ActorLabel}]: ${msg}`);
            });
            return messages.length;
        }
        return 0;
    }

    public static CheckAllEntityData(): void {
        const entities = this.GetAllEntitiesByEditorWorld();
        let totalErrorCount = 0;
        entities.forEach((entity) => {
            totalErrorCount += this.CheckEntity(entity);
        });
        log(`检查完毕, 实体树:${entities.length} 错误数:${totalErrorCount}`);
    }

    public static SpawnEntity(templateId: number, iTransform: ITransform): ITsEntity {
        const template = EntityTemplateOp.GetTemplateById(templateId);
        if (!template) {
            error(`生成Entity失败:无法找到id为[${templateId}]的模板配置`);
            return undefined;
        }

        const entity = EditorLevelLibrary.SpawnActorFromClass(
            getClassByBluprintType(template.BlueprintType),
            toVector(iTransform.Pos),
            toRotation(iTransform.Rot),
        ) as ITsEntity;

        return entity;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static SetITransform(actor: Actor, transform: ITransform): void {
        this.SetTransform(actor, toTransform(transform));
    }

    public static SetTransform(actor: Actor, transform: Transform): void {
        actor.K2_SetActorTransform(transform, false, undefined, false);
    }

    public static GetCameraHitPos(): Vector {
        const cameraPos = new Vector();
        const rotator = new Rotator();
        EditorLevelLibrary.GetLevelViewportCameraInfo($ref(cameraPos), $ref(rotator));
        const dir = rotator.Quaternion().GetForwardVector();
        const endPos = cameraPos.op_Addition(dir.op_Multiply(100 * 100));
        const hitResult = new HitResult();
        const ok = KismetSystemLibrary.LineTraceSingle(
            EditorLevelLibrary.GetEditorWorld(),
            cameraPos,
            endPos,
            ETraceTypeQuery.Camera,
            false,
            undefined,
            EDrawDebugTrace.ForDuration,
            $ref(hitResult),
            true,
        );

        return ok ? hitResult.ImpactPoint : cameraPos;
    }
}

export default LevelEditorUtil;
