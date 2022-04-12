/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { csvCellTypeConfig, TCsvCellType } from '../../../../Game/Flow/Action';
import { Any } from '../../Component/Any';
import { csvCellContext, ICsvCellContext } from '../../Component/CsvView';
import { error } from '../../Log';
import {
    booleanScheme,
    createEnumType,
    createStringScheme,
    floatScheme,
    IAbstractType,
    IAnyProps,
    intScheme,
    stringScheme,
} from '../Type';

export const csvCellTypeScheme = createEnumType(csvCellTypeConfig, {
    Meta: {
        HideName: true,
    },
});

function getCsvCellSchemeByType(type: TCsvCellType): IAbstractType<unknown> {
    switch (type) {
        case 'Int':
            return intScheme;
        case 'Float':
            return floatScheme;
        case 'String':
            return stringScheme;
        case 'Boolean':
            return booleanScheme;
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
