"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderWhoIdsScheme = void 0;
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
const React = require("react");
const react_umg_1 = require("react-umg");
const CsvOp_1 = require("../../../../Common/CsvOp");
const Type_1 = require("../../../../Common/Type");
const CsvRegistry_1 = require("../../../../Game/Common/CsvConfig/CsvRegistry");
const TalkerList_1 = require("../../../../Game/Common/Operations/TalkerList");
const CommonComponent_1 = require("../../BaseComponent/CommonComponent");
function getTalkerCountByCameraBindType(type) {
    switch (type) {
        case 'One':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'None':
            return 0;
        default:
            return 0;
    }
}
const DEFAULT_WHO_ID = 0;
function RenderWhoIdsScheme(props) {
    const ownerActionr = props.Owner;
    const whoIds = ownerActionr.WhoIds;
    const customSeqId = ownerActionr.CustomSeqId;
    const csv = CsvRegistry_1.csvRegistry.Load(Type_1.ECsvName.CustomSeq);
    const cameraBindType = CsvOp_1.csvOp.GetValue(csv, 'Id', customSeqId.toString(), 'BinderType');
    const whoCount = getTalkerCountByCameraBindType(cameraBindType);
    const whoElements = [];
    const talkers = TalkerList_1.TalkerListOp.Get().Talkers;
    for (let i = 0; i < whoCount; i++) {
        const whoId = i < whoIds.length ? whoIds[i] : DEFAULT_WHO_ID;
        const names = TalkerList_1.TalkerListOp.GetNames();
        const selectedTalker = talkers.find((e) => e.Id === whoId);
        whoElements.push(React.createElement(CommonComponent_1.List, { key: i, Items: names, Selected: selectedTalker ? selectedTalker.Name : '', Tip: '绑定对象', OnSelectChanged: (name) => {
                const who = talkers.find((e) => e.Name === name);
                const result = whoIds.slice();
                const selectWhoId = who ? who.Id : DEFAULT_WHO_ID;
                while (result.length < whoCount) {
                    result.push(DEFAULT_WHO_ID);
                }
                result[i] = selectWhoId;
                props.OnModify(result, 'normal');
            } }));
    }
    return React.createElement(react_umg_1.HorizontalBox, null, whoElements);
}
exports.RenderWhoIdsScheme = RenderWhoIdsScheme;
//# sourceMappingURL=Sequence.js.map