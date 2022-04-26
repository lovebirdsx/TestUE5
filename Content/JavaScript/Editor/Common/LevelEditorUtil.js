"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Log_1 = require("../../Common/Log");
const UeHelper_1 = require("../../Common/UeHelper");
const TsEntity_1 = require("../../Game/Entity/TsEntity");
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
    static GetAllEntities(world) {
        const actors = (0, ue_1.NewArray)(ue_1.Actor);
        ue_1.GameplayStatics.GetAllActorsOfClass(world, (0, Class_1.getUeClassByTsClass)(TsEntity_1.default), (0, puerts_1.$ref)(actors));
        const result = [];
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            result.push(actor);
        }
        return result;
    }
    static GetAllEntitiesByEditorWorld() {
        const world = ue_1.EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            (0, Log_1.error)('No editor world exist');
            return [];
        }
        return this.GetAllEntities(world);
    }
}
exports.default = LevelEditorUtil;
//# sourceMappingURL=LevelEditorUtil.js.map