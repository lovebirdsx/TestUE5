"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
class LevelEditor {
    static SelectActor(actor) {
        if (!actor) {
            ue_1.EditorLevelLibrary.ClearActorSelectionSet();
            return;
        }
        const actors = (0, ue_1.NewArray)(ue_1.Actor);
        actors.Add(actor);
        ue_1.EditorLevelLibrary.SetSelectedLevelActors(actors);
    }
    static FocusSelected() {
        ue_1.EditorOperations.ExecuteLevelEditorCommand('CAMERA ALIGN');
    }
}
exports.default = LevelEditor;
//# sourceMappingURL=LevelEditor.js.map