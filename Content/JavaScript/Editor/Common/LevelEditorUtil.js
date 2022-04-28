"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Log_1 = require("../../Common/Log");
const UeHelper_1 = require("../../Common/UeHelper");
const LevelUtil_1 = require("../../Game/Common/LevelUtil");
class LevelEditorUtil {
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
    static GetAllEntitiesByEditorWorld() {
        const world = ue_1.EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            (0, Log_1.error)('No editor world exist');
            return [];
        }
        return LevelUtil_1.LevelUtil.GetAllEntities(world);
    }
}
exports.default = LevelEditorUtil;
//# sourceMappingURL=LevelEditorUtil.js.map