"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelEditor = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Log_1 = require("../../Common/Log");
const Util_1 = require("../../Common/Util");
const Public_1 = require("../../Game/Entity/Public");
const LevelSerializer_1 = require("../../Game/Serialize/LevelSerializer");
const LevelEditorUtil_1 = require("../Common/LevelEditorUtil");
class LevelEditor {
    LevelSerializer = new LevelSerializer_1.LevelSerializer();
    constructor() {
        const editorEvent = ue_1.EditorOperations.GetEditorEvent();
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
        editorEvent.OnDuplicateActorsEnd.Add(this.OnDuplicateActorsEnd.bind(this));
        editorEvent.OnEditPasteActorsEnd.Add(this.OnEditPasteActorsEnd.bind(this));
        editorEvent.OnNewActorsDropped.Add(this.OnNewActorsDropped.bind(this));
    }
    Save() {
        const entities = LevelEditorUtil_1.default.GetAllEntitiesByEditorWorld();
        this.LevelSerializer.Save(entities);
    }
    OnPreBeginPie() {
        (0, Log_1.log)('OnPreBeginPie');
    }
    CheckEntityInit(actor) {
        if (!(0, Class_1.isChildOfClass)(actor, Public_1.TsEntity)) {
            return;
        }
        const entity = actor;
        entity.Guid = (0, Util_1.genGuid)();
    }
    InitForNewActors() {
        const actors = ue_1.EditorLevelLibrary.GetSelectedLevelActors();
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            this.CheckEntityInit(actor);
        }
    }
    OnDuplicateActorsEnd() {
        this.InitForNewActors();
    }
    OnEditPasteActorsEnd() {
        this.InitForNewActors();
    }
    OnNewActorsDropped(actors) {
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            this.CheckEntityInit(actor);
        }
    }
}
exports.LevelEditor = LevelEditor;
//# sourceMappingURL=LevelEditor.js.map