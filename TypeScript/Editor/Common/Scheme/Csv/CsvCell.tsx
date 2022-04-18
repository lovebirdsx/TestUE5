/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { csvCellTypeConfig, TCsvCellType } from '../../../../Common/CsvLoader';
import { csvOp } from '../../../../Common/CsvOp';
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
    TPrimitiveType,
} from '../../../../Common/Type';
import { csvRegistry } from '../../../../Game/Common/CsvConfig/CsvRegistry';
import { List } from '../../ReactComponent/CommonComponent';
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

// 创建csv引用字段Scheme
function createCsvIndexScheme<T extends bigint | number | string>(
    csvName: string,
    indexField: string,
    valueField: string,
    indexType: 'BigInt' | 'Int' | 'String',
): TPrimitiveType<T> {
    const csv = csvRegistry.Load(csvName);
    const [ids, values] = csvOp.GetIndexsAndValues(csv, indexField, valueField);

    if (!ids || !values) {
        throw new Error(
            `Can not create csv index scheme [${csvName}] [${indexField}] [${valueField}]`,
        );
    }

    return {
        RrenderType: 'custom',
        CreateDefault: (container: unknown): T => {
            if (indexType === 'Int') {
                return parseInt(ids[0]) as T;
            } else if (indexType === 'BigInt') {
                return BigInt(ids[0]) as T;
            }
            return ids[0] as T;
        },
        Render: (props: IAnyProps): JSX.Element => {
            const id = props.Value as string;
            const selected = values[ids.indexOf(id)];
            return (
                <List
                    Items={values}
                    Selected={selected}
                    OnSelectChanged={function (item: string): void {
                        const newId = ids[values.indexOf(item)];
                        props.OnModify(newId, 'normal');
                    }}
                />
            );
        },
        Check: () => 0,
        Fix: (value, container) => 'canNotFixed',
        Meta: {},
    };
}

export const talkerNamesScheme = createCsvIndexScheme('对话人', 'Id', 'Name', 'Int');

export const customSeqIdScheme = createCsvIndexScheme('自定义序列', 'Id', 'Name', 'Int');
