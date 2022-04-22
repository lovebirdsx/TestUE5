"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customSeqIdScheme = exports.talkerNamesScheme = exports.csvFollowCellScheme = exports.getCsvCellSchemeByType = exports.csvCellTypeScheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const CsvLoader_1 = require("../../../../Common/CsvLoader");
const Log_1 = require("../../../../Common/Log");
const Type_1 = require("../../../../Common/Type");
function genCsvCellTypeEnumConfig() {
    const configs = CsvLoader_1.csvCellTypeConfig;
    const slotList = Object.entries(configs).map(([type, slot]) => {
        return [type, slot.Desc];
    });
    return Object.fromEntries(slotList);
}
exports.csvCellTypeScheme = (0, Type_1.createEnumScheme)(genCsvCellTypeEnumConfig());
function getCsvCellSchemeByType(type) {
    switch (type) {
        case 'Int':
            return Type_1.intScheme;
        case 'Float':
            return Type_1.floatScheme;
        case 'String':
            return Type_1.stringScheme;
        case 'Boolean':
            return Type_1.booleanScheme;
        default:
            (0, Log_1.error)(`not supported TCsvCellType ${type}`);
            return Type_1.stringScheme;
    }
}
exports.getCsvCellSchemeByType = getCsvCellSchemeByType;
exports.csvFollowCellScheme = (0, Type_1.createStringScheme)({
    Name: 'CsvFollowCell',
});
exports.talkerNamesScheme = (0, Type_1.createCsvIndexValueScheme)({
    Name: 'TalkerNames',
    CsvName: Type_1.ECsvName.Talker,
    IndexField: 'Id',
    ValueField: 'Name',
    IndexType: 'Int',
});
exports.customSeqIdScheme = (0, Type_1.createCsvIndexValueScheme)({
    Name: 'CustomSeqId',
    CsvName: Type_1.ECsvName.CustomSeq,
    IndexField: 'Id',
    ValueField: 'Name',
    IndexType: 'Int',
});
//# sourceMappingURL=CsvCell.js.map