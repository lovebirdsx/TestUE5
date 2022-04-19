/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

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
import { csvRegistry, ECsvName } from '../../../../Game/Common/CsvConfig/CsvRegistry';
import { ConfigFile } from '../../../FlowEditor/ConfigFile';
import { Btn, List } from '../../ReactComponent/CommonComponent';
import { csvCellContext, ICsvCellContext } from '../../ReactComponent/Context';
import { Any } from '../../ReactComponent/Dynamic/Any';
import { sendEditorCommand } from '../../Util';

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

function openCsvEditor(csvName: string): void {
    const configFile = new ConfigFile();
    configFile.Load();
    configFile.CsvName = csvName;
    configFile.Save();

    sendEditorCommand('RestartCsvEditor');
}

// 创建csv引用字段Scheme
function createCsvIndexScheme<T extends bigint | number | string>(
    csvName: ECsvName,
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
                <HorizontalBox>
                    <List
                        Items={values}
                        Selected={selected}
                        Tip={`CSV配置[${csvName}]中的[${valueField}]列`}
                        OnSelectChanged={function (item: string): void {
                            const newId = ids[values.indexOf(item)];
                            props.OnModify(newId, 'normal');
                        }}
                    />
                    <Btn
                        Text={'⊙'}
                        OnClick={(): void => {
                            openCsvEditor(csvName);
                        }}
                        Tip={`打开Csv配置[${csvName}]`}
                    />
                </HorizontalBox>
            );
        },
        Check: () => 0,
        Fix: (value, container) => 'canNotFixed',
        Meta: {
            HideName: true,
        },
    };
}

export const talkerNamesScheme = createCsvIndexScheme<number>(ECsvName.Talker, 'Id', 'Name', 'Int');

export const customSeqIdScheme = createCsvIndexScheme<number>(
    ECsvName.CustomSeq,
    'Id',
    'Name',
    'Int',
);
