"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cameraBindModeScheme = exports.playSequenceDataScheme = exports.seqDataScheme = void 0;
const Action_1 = require("../../../Game/Flow/Action");
const Type_1 = require("./Type");
const DEFAULT_SEQUENCEDATA_PATH = '/Game/Aki/Sequence/Task_Seq/Area_ZD/MainTask/Main_ZD_0001/Base/Main_ZD_0001_001.Main_ZD_0001_001';
exports.seqDataScheme = (0, Type_1.createAssetScheme)({
    CreateDefault: (container) => DEFAULT_SEQUENCEDATA_PATH,
    SearchPath: 'Aki/Sequence',
    ClassPath: `Blueprint'/Game/Aki/Sequence/Manager/BP_SequenceData.BP_SequenceData'`,
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
exports.cameraBindModeScheme = (0, Type_1.createEnumType)(Action_1.cameraBindModeConfig, {
    Meta: {
        HideName: true,
    },
});
//# sourceMappingURL=Sequence.js.map