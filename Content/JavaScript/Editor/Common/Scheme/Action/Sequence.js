"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cameraBindModeScheme = exports.playCustomSequenceScheme = exports.whoIdsScheme = exports.playSequenceDataScheme = exports.seqDataScheme = void 0;
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const Type_1 = require("../../../../Common/Type");
const Action_1 = require("../../../../Game/Flow/Action");
const CsvCell_1 = require("../Csv/CsvCell");
const DEFAULT_SEQUENCEDATA_PATH = '/Game/Test/CustomSequence/Sequence1.Sequence1';
exports.seqDataScheme = (0, Type_1.createAssetScheme)({
    CreateDefault: () => DEFAULT_SEQUENCEDATA_PATH,
    SearchPath: 'Test/CustomSequence',
    ClassPath: `Blueprint'/Game/Test/CustomSequence/CustomSequence.CustomSequence'`,
});
exports.playSequenceDataScheme = (0, Type_1.createObjectScheme)({
    Path: exports.seqDataScheme,
}, {
    Scheduled: true,
    Tip: '播放SequenceData',
});
exports.whoIdsScheme = (0, Type_1.createScheme)({
    Tip: '镜头绑定的对象',
    CreateDefault: () => [],
});
exports.playCustomSequenceScheme = (0, Type_1.createObjectScheme)({
    CustomSeqId: CsvCell_1.customSeqIdScheme,
    WhoIds: exports.whoIdsScheme,
}, {
    Scheduled: true,
    Tip: '播放自定义Sequence',
});
exports.cameraBindModeScheme = (0, Type_1.createEnumScheme)(Action_1.cameraBindModeConfig);
//# sourceMappingURL=Sequence.js.map