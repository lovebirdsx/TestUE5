/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { GridPanel, GridSlot, HorizontalBox, SizeBox } from 'react-umg';

import { ICsv, ICsvFieldEx, TCsvRowBase } from '../../../Common/CsvLoader';
import { error, log } from '../../../Common/Log';
import { TCsvValueType, TModifyType } from '../../../Common/Type';
import { csvScheme } from '../../../Game/Scheme/Csv/CsvScheme';
import { TColor } from '../BaseComponent/Color';
import { Btn, EditorBox, SlotText, Text } from '../BaseComponent/CommonComponent';
import { ContextBtn } from '../BaseComponent/ContextBtn';
import { editorCsvOp } from '../Operations/CsvOp';
import { Any } from '../SchemeComponent/Basic/Public';
import { csvCellContext } from '../SchemeComponent/Context';

export interface ICsvViewProps {
    Csv: ICsv;
    FilterTexts: string[];
    OnModify: (csv: ICsv) => void;
    OnModifyFilterTexts: (id: number, text: string) => void;
}

export class CsvView extends React.Component<ICsvViewProps> {
    private CurrGridRowId: number;

    private readonly IndexColumes = new Map<string, string[]>();

    private OnContextCommand(rowId: number, cmd: string): void {
        switch (cmd) {
            case '上插':
                this.InsertRow(rowId);
                break;
            case '下插':
                this.InsertRow(rowId + 1);
                break;
            case '移除':
                this.RemoveRow(rowId);
                break;
            case '上移':
                this.MoveRow(rowId, true);
                break;
            case '下移':
                this.MoveRow(rowId, false);
                break;
            default:
                error(`Unknown CsvView context command [${cmd}]`);
                break;
        }
    }

    private InsertRow(rowId: number): void {
        const newCsv = editorCsvOp.MutableInsert(this.props.Csv, rowId);
        this.props.OnModify(newCsv);
    }

    private RemoveRow(rowId: number): void {
        const newCsv = editorCsvOp.MutableRemove(this.props.Csv, rowId);
        this.props.OnModify(newCsv);
    }

    private MoveRow(rowId: number, isUp: boolean): void {
        const csv = this.props.Csv;
        if (!editorCsvOp.CanMove(csv, rowId, isUp)) {
            log(`CsvView ${csv.Name} can not move ${isUp ? 'up' : 'down'} for row ${rowId}`);
            return;
        }

        const newCsv = editorCsvOp.MutableMove(this.props.Csv, rowId, isUp);
        this.props.OnModify(newCsv);
    }

    private RenderFilter(fieldTypes: ICsvFieldEx[]): JSX.Element[] {
        const gridRowId = this.CurrGridRowId++;
        const filterTexts = this.props.FilterTexts;
        const result = fieldTypes.map((field, index) => {
            const slot: GridSlot = { Row: gridRowId, Column: index };
            const text = index < filterTexts.length ? filterTexts[index] : '';
            return (
                <HorizontalBox Slot={slot} key={field.Name}>
                    <EditorBox
                        Text={text}
                        Tip={'输入过滤字符串,将只显示对应的行'}
                        Width={index === 0 ? 30 : 60}
                        OnChange={(text: string): void => {
                            this.props.OnModifyFilterTexts(index, text);
                        }}
                    />
                    <Btn
                        Text={'C'}
                        Tip={'清空过滤内容'}
                        OnClick={(): void => {
                            this.props.OnModifyFilterTexts(index, '');
                        }}
                    />
                </HorizontalBox>
            );
        });
        return result;
    }

    private RenderHead(fieldTypes: ICsvFieldEx[]): JSX.Element[] {
        const gridRowId = this.CurrGridRowId++;
        const result = fieldTypes.map((field, index) => {
            const slot: GridSlot = { Row: gridRowId, Column: index };
            if (editorCsvOp.IsIndexField(field)) {
                return (
                    <HorizontalBox key={field.Name} Slot={slot}>
                        <Btn
                            Text={'+'}
                            Width={28}
                            OnClick={(): void => {
                                this.InsertRow(this.props.Csv.Rows.length);
                            }}
                        />
                        <SlotText Text={field.CnName} />
                    </HorizontalBox>
                );
            }

            return (
                <HorizontalBox key={field.Name} Slot={slot}>
                    <SlotText Text={` ${field.CnName} `} />
                </HorizontalBox>
            );
        });

        return result;
    }

    private ModifyValue(rowId: number, fieldName: string, value: TCsvValueType): void {
        const newCsv = produce(this.props.Csv, (draft) => {
            draft.Rows[rowId][fieldName] = value;
        });
        this.props.OnModify(newCsv);
    }

    private IsInFilter(fieldTypes: ICsvFieldEx[], row: TCsvRowBase): boolean {
        const filterTexts = this.props.FilterTexts;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < fieldTypes.length; i++) {
            const field = fieldTypes[i];
            const filter = filterTexts[i];
            const value = row[field.Name];

            if (value && !value.toString().includes(filter)) {
                return false;
            }
        }
        return true;
    }

    private RenderRow(fieldTypes: ICsvFieldEx[], row: TCsvRowBase, rowId: number): JSX.Element[] {
        if (!this.IsInFilter(fieldTypes, row)) {
            return [];
        }

        const csv = this.props.Csv;
        const gridRowId = this.CurrGridRowId++;
        const result = fieldTypes.map((field, index) => {
            const slot: GridSlot = { Row: gridRowId, Column: index };
            if (!field.Meta) {
                return (
                    <Text
                        Text={'未知类型'}
                        Tip={'请配置对应Csv字段的Meta成员'}
                        Slot={slot}
                        key={`${rowId}-${index}`}
                    />
                );
            }

            // 索引字段不能直接修改
            if (editorCsvOp.IsIndexField(field)) {
                return (
                    <HorizontalBox Slot={slot} key={`${rowId}-${index}`}>
                        <ContextBtn
                            Commands={['上插', '下插', '移除', '上移', '下移']}
                            OnCommand={(cmd): void => {
                                this.OnContextCommand(rowId, cmd);
                            }}
                        />
                        <SlotText Text={row[field.Name].toString()} />
                    </HorizontalBox>
                );
            }

            // 重复的字段提示红色
            let color: TColor = undefined;
            if (field.Filter === '1') {
                const colValues = this.IndexColumes.get(field.Name);
                const value = row[field.Name];
                if (value && colValues.find((e, id) => e === value && rowId !== id)) {
                    color = '#8B0000 dark red';
                }
            }

            return (
                <SizeBox Slot={slot} key={`${rowId}-${index}`}>
                    <csvCellContext.Provider value={{ RowId: rowId, ColId: index, Csv: csv }}>
                        <Any
                            Color={color}
                            Value={row[field.Name]}
                            Scheme={csvScheme.GetSchme(field.Meta)}
                            OnModify={(value: unknown, type: TModifyType): void => {
                                this.ModifyValue(rowId, field.Name, value as TCsvValueType);
                            }}
                        />
                    </csvCellContext.Provider>
                </SizeBox>
            );
        });
        return result;
    }

    private RenderRows(fieldTypes: ICsvFieldEx[], rows: TCsvRowBase[]): JSX.Element[] {
        const result: JSX.Element[] = [];
        rows.forEach((row, id) => {
            result.push(...this.RenderRow(fieldTypes, row, id));
        });
        return result;
    }

    private UpdateIndexCols(): void {
        this.IndexColumes.clear();
        const indexNames: string[] = [];
        this.props.Csv.FiledTypes.forEach((fieldType) => {
            if (fieldType.Filter === '1') {
                this.IndexColumes.set(fieldType.Name, []);
                indexNames.push(fieldType.Name);
            }
        });

        this.props.Csv.Rows.forEach((row) => {
            indexNames.forEach((name) => {
                const value = row[name] as string;
                this.IndexColumes.get(name).push(value);
            });
        });
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const csv = this.props.Csv;
        this.CurrGridRowId = 0;
        this.UpdateIndexCols();
        return (
            <GridPanel>
                {this.RenderFilter(csv.FiledTypes)}
                {this.RenderHead(csv.FiledTypes)}
                {this.RenderRows(csv.FiledTypes, csv.Rows)}
            </GridPanel>
        );
    }
}
