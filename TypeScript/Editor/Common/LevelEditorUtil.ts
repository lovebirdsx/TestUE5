import {
    Actor,
    BuiltinString,
    EditorAssetLibrary,
    EditorLevelLibrary,
    EditorOperations,
    NewArray,
} from 'ue';

import { getAssetPath } from '../../Common/Class';
import { error } from '../../Common/Log';
import { toUeArray } from '../../Common/UeHelper';
import { LevelUtil } from '../../Game/Common/LevelUtil';
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
}

export default LevelEditorUtil;
