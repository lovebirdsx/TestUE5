"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMap = void 0;
const puerts_1 = require("puerts");
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Log_1 = require("../../Common/Log");
const Public_1 = require("../../Game/Entity/Public");
const CommonComponent_1 = require("../Common/BaseComponent/CommonComponent");
class TestMap extends React.Component {
    constructor() {
        super(undefined);
        const editorEvent = ue_1.EditorOperations.GetEditorEvent();
        editorEvent.OnPreSaveWorld.Add(this.OnPreSaveWorld.bind(this));
        editorEvent.ActorPropertiesChange.Add(this.ActorPropertiesChange.bind(this));
        editorEvent.OnEditCutActorsBegin.Add(this.OnEditCutActorsBegin.bind(this));
        editorEvent.OnEditCutActorsEnd.Add(this.OnEditCutActorsEnd.bind(this));
        editorEvent.OnEditCopyActorsBegin.Add(this.OnEditCopyActorsBegin.bind(this));
        editorEvent.OnEditCopyActorsEnd.Add(this.OnEditCopyActorsEnd.bind(this));
        editorEvent.OnEditPasteActorsBegin.Add(this.OnEditPasteActorsBegin.bind(this));
        editorEvent.OnEditPasteActorsEnd.Add(this.OnEditPasteActorsEnd.bind(this));
        editorEvent.OnDuplicateActorsBegin.Add(this.OnDuplicateActorsBegin.bind(this));
        editorEvent.OnDuplicateActorsEnd.Add(this.OnDuplicateActorsEnd.bind(this));
        // Delete Actor的消息并没有正常触发
        editorEvent.OnDeleteActorsBegin.Add(this.OnDeleteActorsBegin.bind(this));
        editorEvent.OnDeleteActorsEnd.Add(this.OnDeleteActorsEnd.bind(this));
        editorEvent.OnNewActorsDropped.Add(this.OnNewActorsDropped.bind(this));
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
        editorEvent.OnBeginPie.Add(this.OnBeginPie.bind(this));
        editorEvent.OnEndPie.Add(this.OnEndPie.bind(this));
        editorEvent.OnPausePie.Add(this.OnPausePie.bind(this));
        editorEvent.OnResumePie.Add(this.OnResumePie.bind(this));
    }
    OnGetAllEntities = () => {
        const world = ue_1.EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            (0, Log_1.warn)('No editor world exist');
            return;
        }
        const actors = (0, ue_1.NewArray)(ue_1.Actor);
        ue_1.GameplayStatics.GetAllActorsOfClass(world, (0, Class_1.getUeClassByTsClass)(Public_1.TsEntity), (0, puerts_1.$ref)(actors));
        (0, Log_1.log)(`TsEntity count = ${actors.Num()}`);
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            const status = [];
            status.push(`${i} ${actor.GetName()} bHidden=${actor.bHidden}`);
            status.push(`IsActorBeingDestroyed=${actor.IsActorBeingDestroyed()}`);
            (0, Log_1.log)(status.join(' '));
        }
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.Btn, { Text: 'Get all entities', OnClick: this.OnGetAllEntities })));
    }
    OnPreSaveWorld() {
        (0, Log_1.log)('OnPreSaveWorld');
    }
    ActorPropertiesChange() {
        (0, Log_1.log)('ActorPropertiesChange');
    }
    OnEditCutActorsBegin() {
        (0, Log_1.log)('OnEditCutActorsBegin');
    }
    OnEditCutActorsEnd() {
        (0, Log_1.log)('OnEditCutActorsEnd');
    }
    OnEditCopyActorsBegin() {
        (0, Log_1.log)('OnEditCopyActorsBegin');
    }
    OnEditCopyActorsEnd() {
        (0, Log_1.log)('OnEditCopyActorsEnd');
    }
    OnEditPasteActorsBegin() {
        (0, Log_1.log)('OnEditPasteActorsBegin');
    }
    OnEditPasteActorsEnd() {
        (0, Log_1.log)('OnEditPasteActorsEnd');
    }
    OnDuplicateActorsBegin() {
        (0, Log_1.log)('OnDuplicateActorsBegin');
    }
    OnDuplicateActorsEnd() {
        (0, Log_1.log)('OnDuplicateActorsEnd');
    }
    OnDeleteActorsBegin() {
        (0, Log_1.log)('OnDeleteActorsBegin');
    }
    OnDeleteActorsEnd() {
        (0, Log_1.log)('OnDeleteActorsEnd');
    }
    OnNewActorsDropped(actors) {
        (0, Log_1.log)(`OnNewActorsDropped actors count = ${actors.Num()}`);
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            (0, Log_1.log)(`${i} ${actor.GetName()}`);
        }
    }
    OnPreBeginPie() {
        (0, Log_1.log)('OnPreBeginPie');
    }
    OnBeginPie(isSim) {
        (0, Log_1.log)(`OnBeginPie isSim ${isSim}`);
    }
    OnEndPie() {
        (0, Log_1.log)('OnEndPie');
    }
    OnPausePie() {
        (0, Log_1.log)('OnPausePie');
    }
    OnResumePie() {
        (0, Log_1.log)('OnResumePie');
    }
}
exports.TestMap = TestMap;
//# sourceMappingURL=TestMap.js.map