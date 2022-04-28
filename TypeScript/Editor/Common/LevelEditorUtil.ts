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

    public static GetAllEntitiesByEditorWorld(): TsEntity[] {
        const world = EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            error('No editor world exist');
            return [];
        }

        return LevelUtil.GetAllEntities(world);
    }
}

export default LevelEditorUtil;
