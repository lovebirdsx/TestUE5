"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const CsvLoader_1 = require("../../../../Common/CsvLoader");
const Type_1 = require("../../../../Common/Type");
const Sequence_1 = require("../Action/Sequence");
const CsvCell_1 = require("./CsvCell");
const csvSchemaMap2 = {
    [CsvLoader_1.ECsvCellRenderType.String]: Type_1.stringScheme,
    [CsvLoader_1.ECsvCellRenderType.Int]: Type_1.intScheme,
    [CsvLoader_1.ECsvCellRenderType.Float]: Type_1.floatScheme,
    [CsvLoader_1.ECsvCellRenderType.Boolean]: Type_1.booleanScheme,
    [CsvLoader_1.ECsvCellRenderType.CameraBinderMode]: Sequence_1.cameraBindModeScheme,
    [CsvLoader_1.ECsvCellRenderType.CellType]: CsvCell_1.csvCellTypeScheme,
    [CsvLoader_1.ECsvCellRenderType.FollowCell]: CsvCell_1.csvFollowCellScheme,
    [CsvLoader_1.ECsvCellRenderType.SequenceData]: Sequence_1.seqDataScheme,
};
/* eslint-disable spellcheck/spell-checker */
class CsvScheme {
    GetSchme(meta) {
        return csvSchemaMap2[meta.RenderType];
    }
}
exports.csvScheme = new CsvScheme();
//# sourceMappingURL=CsvScheme.js.map