/* eslint-disable spellcheck/spell-checker */
import { error } from '../../../../Common/Log';
import { csvCellTypeConfig, TCsvCellType } from '../../../../Game/Common/CsvConfig/CsvLoader';
import { ECsvName } from '../../../../Game/Common/CsvConfig/CsvRegistry';
import { entityTemplateManager } from '../../EntityTemplateManager';
import {
    booleanScheme,
    createCsvIndexValueScheme,
    createEnumScheme,
    createIntScheme,
    createStringScheme,
    floatScheme,
    intScheme,
    Scheme,
    stringScheme,
} from '../../Type';

interface ICellConfigSlot {
    Desc: string;
}

function genCsvCellTypeEnumConfig(): Record<string, string> {
    const configs = csvCellTypeConfig as Record<string, ICellConfigSlot>;
    const slotList = Object.entries(configs).map(([type, slot]) => {
        return [type, slot.Desc];
    });
    return Object.fromEntries(slotList) as Record<string, string>;
}

export const csvCellTypeScheme = createEnumScheme({
    Config: genCsvCellTypeEnumConfig(),
});

export function getCsvCellSchemeByType(type: TCsvCellType): Scheme {
    switch (type) {
        case 'Int':
            return intScheme as Scheme;
        case 'Float':
            return floatScheme as Scheme;
        case 'String':
            return stringScheme as Scheme;
        case 'Boolean':
            return booleanScheme as Scheme;
        default:
            error(`not supported TCsvCellType ${type}`);
            return stringScheme;
    }
}

export const csvFollowCellScheme = createStringScheme({
    Name: 'CsvFollowCell',
});

export const talkerNamesScheme = createCsvIndexValueScheme<number>({
    Name: 'TalkerNames',
    CsvName: ECsvName.Talker,
    IndexField: 'Id',
    ValueField: 'Name',
    IndexType: 'Int',
});

export const customSeqIdScheme = createCsvIndexValueScheme<number>({
    Name: 'CustomSeqId',
    CsvName: ECsvName.CustomSeq,
    IndexField: 'Id',
    ValueField: 'Name',
    IndexType: 'Int',
});

export const csvEntityTemplateIdScheme = createIntScheme({
    Name: 'EntityTemplateId',
    CreateDefault: () => {
        return entityTemplateManager.GenDefaultId();
    },
});
