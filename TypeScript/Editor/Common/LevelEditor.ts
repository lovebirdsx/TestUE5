import { Actor, EditorLevelLibrary, EditorOperations, NewArray } from 'ue';

class LevelEditor {
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
}

export default LevelEditor;
