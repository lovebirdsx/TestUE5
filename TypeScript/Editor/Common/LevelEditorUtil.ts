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
    Vector,
} from 'ue';

import { getAssetPath, getBlueprintType } from '../../Common/Class';
import { ITransform, toRotation, toTransform, toVector } from '../../Common/Interface';
import { error } from '../../Common/Log';
import { toUeArray } from '../../Common/UeHelper';
import { LevelUtil } from '../../Game/Common/LevelUtil';
import { EntityTemplateOp } from '../../Game/Common/Operations/EntityTemplate';
import { isEntity } from '../../Game/Entity/EntityRegistry';
import { ITsEntity } from '../../Game/Interface';

class LevelEditorUtil {
    public static SelectActor(actor: Actor): void {
        if (!actor) {
            EditorLevelLibrary.ClearActorSelectionSet();
            return;
        }
        const actors = NewArray(Actor);
        actors.Add(actor);
        EditorLevelLibrary.SetSelectedLevelActors(actors);
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

    public static SpawnEntity(guid: string, iTransform: ITransform): ITsEntity {
        const template = EntityTemplateOp.GetTemplateByGuid(guid);
        if (!template) {
            error(`生成Entity失败:无法找到Guid为[${guid}]的模板配置`);
            return undefined;
        }

        const entity = EditorLevelLibrary.SpawnActorFromClass(
            getBlueprintType(template.PrefabId),
            toVector(iTransform.Pos),
            toRotation(iTransform.Rot),
        ) as ITsEntity;

        return entity;
    }

    public static SetEntityTransform(entity: ITsEntity, transform: ITransform): void {
        entity.K2_SetActorTransform(toTransform(transform), false, undefined, false);
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
