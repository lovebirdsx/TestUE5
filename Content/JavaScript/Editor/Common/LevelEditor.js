"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const UeHelper_1 = require("../../Common/UeHelper");
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
    static FocusOnSelectedBlueprint(actor) {
        const path = (0, Class_1.getAssetPath)(actor.GetClass());
        ue_1.EditorAssetLibrary.SyncBrowserToObjects((0, UeHelper_1.toUeArray)([path], ue_1.BuiltinString));
    }
    static get IsPlaying() {
        return ue_1.EditorOperations.GetEditorEngine().PlayWorld !== undefined;
    }
}
exports.default = LevelEditor;
//# sourceMappingURL=LevelEditor.js.map