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
    EFileRoot,
    ETraceTypeQuery,
    HitResult,
    KismetSystemLibrary,
    MyFileHelper,
    NewArray,
    Package,
    Rotator,
    Transform,
    Vector,
} from 'ue';

import { getAssetPath, getBlueprintClass } from '../../Common/Class';
import { ITransform, toRotation, toTransform, toVector } from '../../Common/Interface';
import { error, log } from '../../Common/Log';
import { toUeArray } from '../../Common/UeHelper';
import { writeJsonConfig } from '../../Common/Util';
import { LevelUtil } from '../../Game/Common/LevelUtil';
import { EntityTemplateOp } from '../../Game/Common/Operations/EntityTemplate';
import { entityRegistry, isEntity } from '../../Game/Entity/EntityRegistry';
import { Component, ITsEntity, parseComponentsState } from '../../Game/Interface';

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

    public static FindFirstEntityByGuidFilter(filter: string): ITsEntity {
        const entities = this.GetAllEntitiesByEditorWorld();
        return entities.find((entity) => entity.Guid.includes(filter));
    }

    public static GetEntity(guid: string): ITsEntity {
        const entities = this.GetAllEntitiesByEditorWorld();
        return entities.find((entity) => entity.Guid === guid);
    }

    public static GetEntityComponentData<T extends Component>(
        entity: ITsEntity,
        componentClass: new () => T,
    ): T {
        const componentsState = parseComponentsState(entity.ComponentsStateJson);
        return componentsState[componentClass.name] as T;
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

    private static GenEntityJsonPath(pkgPath: string): string {
        const pathBaseOnContent = pkgPath.substring(6);
        return MyFileHelper.GetPath(EFileRoot.Content, pathBaseOnContent) + '.json';
    }

    public static SaveEntityData(entity: ITsEntity): void {
        const externActorPath = EditorOperations.GetExternActorSavePath(entity);
        if (!externActorPath) {
            error(`Can not find extern actor path for ${entity.ActorLabel}`);
            return;
        }

        const entityJsonPath = this.GenEntityJsonPath(externActorPath);
        const entityData = entityRegistry.GenData(entity);
        writeJsonConfig(entityData, entityJsonPath);
        log(`Write: ${entityJsonPath}`);
    }

    // 尝试移除package对应的Entity配置数据
    public static TryRemoveEntityByPackage(pkg: Package): void {
        const pkgPath = pkg.GetName();
        if (!pkgPath.includes('__ExternalActors__')) {
            return;
        }

        const entityJsonPath = this.GenEntityJsonPath(pkg.GetName());
        MyFileHelper.Remove(entityJsonPath);
        log(`Remove: ${entityJsonPath}`);
    }

    public static SaveCurrentEntityData(): void {
        const entity = this.GetSelectedEntity();
        if (!entity) {
            return;
        }

        this.SaveEntityData(entity);
    }

    public static SaveAllEntityData(): void {
        const entities = this.GetAllEntitiesByEditorWorld();
        entities.forEach((entity) => {
            this.SaveEntityData(entity);
        });
    }

    public static SpawnEntity(guid: string, iTransform: ITransform): ITsEntity {
        const template = EntityTemplateOp.GetTemplateByGuid(guid);
        if (!template) {
            error(`生成Entity失败:无法找到Guid为[${guid}]的模板配置`);
            return undefined;
        }

        const entity = EditorLevelLibrary.SpawnActorFromClass(
            getBlueprintClass(template.PrefabId),
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
