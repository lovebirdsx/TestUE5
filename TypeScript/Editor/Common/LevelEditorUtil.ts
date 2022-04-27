import { $ref } from 'puerts';
import {
    Actor,
    BuiltinString,
    EditorAssetLibrary,
    EditorLevelLibrary,
    EditorOperations,
    GameplayStatics,
    NewArray,
    World,
} from 'ue';

import { getAssetPath, getUeClassByTsClass } from '../../Common/Class';
import { error } from '../../Common/Log';
import { toUeArray } from '../../Common/UeHelper';
import { TsEntity } from '../../Game/Entity/Public';

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

    public static GetAllEntities(world: World): TsEntity[] {
        const actors = NewArray(Actor);
        GameplayStatics.GetAllActorsOfClass(world, getUeClassByTsClass(TsEntity), $ref(actors));
        const result: TsEntity[] = [];
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            result.push(actor as TsEntity);
        }
        return result;
    }

    public static GetAllEntitiesByEditorWorld(): TsEntity[] {
        const world = EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            error('No editor world exist');
            return [];
        }

        return this.GetAllEntities(world);
    }
}

export default LevelEditorUtil;
