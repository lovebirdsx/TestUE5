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
    GameplayStatics,
    HitResult,
    KismetSystemLibrary,
    NewArray,
    Rotator,
    Transform,
    Vector,
    World,
} from 'ue';

import { toRotation, toTransform, toVector } from '../../Common/Interface/Action';
import {
    getClassByBluprintType,
    getClassByEntityType,
    isEntityClass,
    isRegistedEntity,
} from '../../Common/Interface/Entity';
import { ITransform } from '../../Common/Interface/IAction';
import { TComponentType } from '../../Common/Interface/IComponent';
import { ITsEntityBase } from '../../Common/Interface/IEntity';
import { error, log } from '../../Common/Misc/Log';
import { getAssetPath, isValidActor, toUeArray } from '../../Common/Misc/Util';
import { entityTemplateManager } from './EntityTemplateManager';
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

    public static GetAllEntities(world: World): ITsEntityBase[] {
        // Entity
        const entities = NewArray(Actor);
        GameplayStatics.GetAllActorsOfClass(world, getClassByEntityType('Entity'), $ref(entities));
        const result: ITsEntityBase[] = [];
        for (let i = 0; i < entities.Num(); i++) {
            const entity = entities.Get(i);
            result.push(entity as ITsEntityBase);
        }

        // Character Entity
        const characterEntities = NewArray(Actor);
        GameplayStatics.GetAllActorsOfClass(
            world,
            getClassByEntityType('CharacterEntity'),
            $ref(characterEntities),
        );
        for (let i = 0; i < characterEntities.Num(); i++) {
            const characterEntity = characterEntities.Get(i);
            result.push(characterEntity as ITsEntityBase);
        }

        return result;
    }

    public static GetAllEntitiesByEditorWorld(): ITsEntityBase[] {
        const world = EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            error('No editor world exist');
            return [];
        }

        return this.GetAllEntities(world);
    }

    public static GetEntity(id: number): ITsEntityBase {
        const entities = this.GetAllEntitiesByEditorWorld();
        return entities.find((entity) => entity.Id === id);
    }

    public static GetEntityComponentData<T>(
        entity: ITsEntityBase,
        componentType: TComponentType,
    ): T {
        const data = levelDataManager.GetEntityData(entity);
        return data.ComponentsData[componentType] as T;
    }

    public static GetSelectedEntity(): ITsEntityBase {
        const actors = EditorLevelLibrary.GetSelectedLevelActors();

        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            if (isEntityClass(actor.GetClass()) && isValidActor(actor)) {
                const entity = actor as ITsEntityBase;
                if (isRegistedEntity(entity)) {
                    return entity;
                }
                return undefined;
            }
        }

        return undefined;
    }

    public static CheckAndSaveEntityData(entity: ITsEntityBase): void {
        const currentData = entityRegistry.GenData(entity);
        const savedData = levelDataManager.GetEntityData(entity);
        if (JSON.stringify(currentData) !== JSON.stringify(savedData)) {
            levelDataManager.ModifyEntityData(entity, currentData);
        }
    }

    public static CheckAndSaveAllEntityData(): void {
        const entities = this.GetAllEntitiesByEditorWorld();
        entities.forEach((entity) => {
            this.CheckAndSaveEntityData(entity);
        });
    }

    public static SaveEntityData(entity: ITsEntityBase): void {
        const currentData = entityRegistry.GenData(entity);
        levelDataManager.ModifyEntityData(entity, currentData);
    }

    public static CheckEntity(entity: ITsEntityBase): number {
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
        log(`检查完毕, 实体数:${entities.length} 错误数:${totalErrorCount}`);
    }

    public static SpawnEntity(templateId: number, iTransform: ITransform): ITsEntityBase {
        const template = entityTemplateManager.GetTemplateById(templateId);
        if (!template) {
            error(`生成Entity失败:无法找到id为[${templateId}]的模板配置`);
            return undefined;
        }

        const entity = EditorLevelLibrary.SpawnActorFromClass(
            getClassByBluprintType(template.BlueprintType),
            toVector(iTransform.Pos),
            toRotation(iTransform.Rot),
        ) as ITsEntityBase;

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
