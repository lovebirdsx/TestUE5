/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { GridPanel, GridSlot, HorizontalBox, SizeBox } from 'react-umg';

import { Csv, ICsv, ICsvFieldEx, TCsvRowBase, TCsvValueType } from '../CsvLoader';
import { error, log } from '../Log';
import { TModifyType } from '../Scheme/Type';
import { Any } from './Any';
import { Btn, SlotText, Text } from './CommonComponent';
import { ContextBtn } from './ContextBtn';

export interface ICsvViewProps {
    Csv: ICsv;
    OnModify: (csv: ICsv) => void;
}

export interface ICsvCellContext {
    RowId: number;
    ColId: number;
    Csv: ICsv;
}

export const csvCellContext = React.createContext<ICsvCellContext>(undefined);

export class CsvView extends React.Component<ICsvViewProps> {
    private OnContextCommand(rowId: number, cmd: string): void {
        switch (cmd) {
            case 'insert':
                this.InsertRow(rowId);
                break;
            case 'remove':
                this.RemoveRow(rowId);
                break;
            case 'moveUp':
                this.MoveRow(rowId, true);
                break;
            case 'moveDown':
                this.MoveRow(rowId, false);
                break;
            default:
                error(`Unknown CsvView context command [${cmd}]`);
                break;
        }
    }

    private InsertRow(rowId: number): void {
        const newCsv = Csv.MutableInsert(this.props.Csv, rowId);
        this.props.OnModify(newCsv);
    }

    private RemoveRow(rowId: number): void {
        const newCsv = Csv.MutableRemove(this.props.Csv, rowId);
        this.props.OnModify(newCsv);
    }

    private MoveRow(rowId: number, isUp: boolean): void {
        const csv = this.props.Csv;
        if (!Csv.CanMove(csv, rowId, isUp)) {
            log(`CsvView ${csv.Name} can not move ${isUp ? 'up' : 'down'} for row ${rowId}`);
            return;
        }

        const newCsv = Csv.MutableMove(this.props.Csv, rowId, isUp);
        this.props.OnModify(newCsv);
    }

    private RenderHead(fieldTypes: ICsvFieldEx[]): JSX.Element[] {
        const result = fieldTypes.map((field, index) => {
            const slot: GridSlot = { Row: 0, Column: index };
            if (Csv.IsIndexField(field)) {
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

    private RenderRow(fieldTypes: ICsvFieldEx[], row: TCsvRowBase, rowId: number): JSX.Element[] {
        const csv = this.props.Csv;
        const result = fieldTypes.map((field, index) => {
            const slot: GridSlot = { Row: rowId + 1, Column: index };
            if (!field.TypeData) {
                return (
                    <Text
                        Text={'未知类型'}
                        Tip={'请配置对应Csv字段的TypeData成员'}
                        Slot={slot}
                        key={`${rowId}-${index}`}
                    />
                );
            }

            // 索引字段不能直接修改
            if (Csv.IsIndexField(field)) {
                return (
                    <HorizontalBox Slot={slot} key={`${rowId}-${index}`}>
                        <ContextBtn
                            Commands={['insert', 'remove', 'moveUp', 'moveDown']}
                            OnCommand={(cmd): void => {
                                this.OnContextCommand(rowId, cmd);
                            }}
                        />
                        <SlotText Text={row[field.Name].toString()} />
                    </HorizontalBox>
                );
            }

            return (
                <SizeBox Slot={slot} key={`${rowId}-${index}`}>
                    <csvCellContext.Provider value={{ RowId: rowId, ColId: index, Csv: csv }}>
                        <Any
                            Value={row[field.Name]}
                            Type={field.TypeData}
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const csv = this.props.Csv;
        return (
            <GridPanel>
                {this.RenderHead(csv.FiledTypes)}
                {this.RenderRows(csv.FiledTypes, csv.Rows)}
            </GridPanel>
        );
    }
}
