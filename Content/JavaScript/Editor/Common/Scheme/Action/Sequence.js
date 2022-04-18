"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cameraBindModeScheme = exports.playCustomSequenceScheme = exports.playSequenceDataScheme = exports.seqDataScheme = void 0;
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const Type_1 = require("../../../../Common/Type");
const Action_1 = require("../../../../Game/Flow/Action");
const Index_1 = require("../../ReactComponent/Dynamic/Index");
const CsvCell_1 = require("../Csv/CsvCell");
const DEFAULT_SEQUENCEDATA_PATH = '/Game/Test/CustomSequence/Sequence1.Sequence1';
exports.seqDataScheme = (0, Type_1.createAssetScheme)({
    CreateDefault: (container) => DEFAULT_SEQUENCEDATA_PATH,
    SearchPath: 'Test/CustomSequence',
    ClassPath: `Blueprint'/Game/Test/CustomSequence/CustomSequence.CustomSequence'`,
    Meta: {
        HideName: true,
    },
});
exports.playSequenceDataScheme = (0, Type_1.createObjectScheme)({
    Path: exports.seqDataScheme,
}, {
    Scheduled: true,
    Meta: {
        Tip: '播放SequenceData',
    },
});
function renderPlayCustomSequence(props) {
    const action = props.Value;
    return (React.createElement(react_umg_1.HorizontalBox, null,
        React.createElement(Index_1.Any, { Value: action.CustomSeqId, Type: CsvCell_1.customSeqIdScheme, OnModify: (newId, type) => {
                const newProps = (0, immer_1.default)(action, (draft) => {
                    draft.CustomSeqId = newId;
                });
                props.OnModify(newProps, type);
            } })));
}
exports.playCustomSequenceScheme = (0, Type_1.createObjectScheme)({
    CustomSeqId: undefined,
    WhoIds: undefined,
}, {
    Scheduled: true,
    Meta: {
        Tip: '播放自定义Sequence',
    },
    Render: renderPlayCustomSequence,
});
exports.cameraBindModeScheme = (0, Type_1.createEnumType)(Action_1.cameraBindModeConfig, {
    Meta: {
        HideName: true,
    },
});
//# sourceMappingURL=Sequence.js.map