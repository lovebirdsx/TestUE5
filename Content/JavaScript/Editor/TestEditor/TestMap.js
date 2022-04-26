"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMap = void 0;
const puerts_1 = require("puerts");
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Log_1 = require("../../Common/Log");
const TsEntity_1 = require("../../Game/Entity/TsEntity");
const CommonComponent_1 = require("../Common/BaseComponent/CommonComponent");
class TestMap extends React.Component {
    OnGetAllEntities = () => {
        const world = ue_1.EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            (0, Log_1.warn)('No editor world exist');
            return;
        }
        const actors = (0, ue_1.NewArray)(ue_1.Actor);
        ue_1.GameplayStatics.GetAllActorsOfClass(world, (0, Class_1.getUeClassByTsClass)(TsEntity_1.default), (0, puerts_1.$ref)(actors));
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
}
exports.TestMap = TestMap;
//# sourceMappingURL=TestMap.js.map