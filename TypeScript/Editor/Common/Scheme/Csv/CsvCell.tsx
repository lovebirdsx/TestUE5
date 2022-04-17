/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { csvCellTypeConfig, TCsvCellType } from '../../../../Common/CsvLoader';
import { error } from '../../../../Common/Log';
import {
    booleanScheme,
    createEnumType,
    createStringScheme,
    floatScheme,
    IAbstractType,
    IAnyProps,
    intScheme,
    stringScheme,
} from '../../../../Common/Type';
import { csvCellContext, ICsvCellContext } from '../../ReactComponent/Context';
import { Any } from '../../ReactComponent/Dynamic';

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

export const csvCellTypeScheme = createEnumType(genCsvCellTypeEnumConfig(), {
    Meta: {
        HideName: true,
    },
});

function getCsvCellSchemeByType(type: TCsvCellType): IAbstractType<unknown> {
    switch (type) {
        case 'Int':
            return intScheme as IAbstractType<unknown>;
        case 'Float':
            return floatScheme as IAbstractType<unknown>;
        case 'String':
            return stringScheme as IAbstractType<unknown>;
        case 'Boolean':
            return booleanScheme as IAbstractType<unknown>;
        default:
            error(`not supported TCsvCellType ${type}`);
            return stringScheme;
    }
}

export const csvFollowCellScheme = createStringScheme({
    RrenderType: 'custom',
    CreateDefault: (container: unknown) => '',
    Render: (props: IAnyProps): JSX.Element => {
        return (
            <csvCellContext.Consumer>
                {(ctx: ICsvCellContext): React.ReactNode => {
                    const csv = ctx.Csv;
                    const prevCellName = csv.FiledTypes[ctx.ColId - 1].Name;
                    const prevCellvalue = ctx.Csv.Rows[ctx.RowId][prevCellName] as TCsvCellType;
                    const scheme = getCsvCellSchemeByType(prevCellvalue);
                    return <Any {...props} Type={scheme} />;
                }}
            </csvCellContext.Consumer>
        );
    },
});
