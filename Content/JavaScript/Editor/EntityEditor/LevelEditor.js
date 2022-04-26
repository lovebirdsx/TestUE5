"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelEditor = void 0;
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
const LevelSerializer_1 = require("../../Game/Serialize/LevelSerializer");
const LevelEditorUtil_1 = require("../Common/LevelEditorUtil");
class LevelEditor {
    LevelSerializer = new LevelSerializer_1.LevelSerializer();
    constructor() {
        const editorEvent = ue_1.EditorOperations.GetEditorEvent();
        editorEvent.OnPreSaveWorld.Add(this.OnPreSaveWorld.bind(this));
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
    }
    Save() {
        const entities = LevelEditorUtil_1.default.GetAllEntitiesByEditorWorld();
        this.LevelSerializer.Save(entities);
    }
    OnPreSaveWorld() {
        (0, Log_1.log)('OnPreSaveWorld');
    }
    OnPreBeginPie() {
        (0, Log_1.log)('OnPreBeginPie');
    }
}
exports.LevelEditor = LevelEditor;
//# sourceMappingURL=LevelEditor.js.map