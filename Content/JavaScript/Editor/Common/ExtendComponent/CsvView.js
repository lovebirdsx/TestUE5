"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvView = void 0;
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const Log_1 = require("../../../Common/Log");
const CommonComponent_1 = require("../BaseComponent/CommonComponent");
const ContextBtn_1 = require("../BaseComponent/ContextBtn");
const CsvOp_1 = require("../Operations/CsvOp");
const CsvScheme_1 = require("../Scheme/Csv/CsvScheme");
const Public_1 = require("../SchemeComponent/Basic/Public");
const Context_1 = require("../SchemeComponent/Context");
class CsvView extends React.Component {
    CurrGridRowId;
    IndexColumes = new Map();
    OnContextCommand(rowId, cmd) {
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
                (0, Log_1.error)(`Unknown CsvView context command [${cmd}]`);
                break;
        }
    }
    InsertRow(rowId) {
        const newCsv = CsvOp_1.editorCsvOp.MutableInsert(this.props.Csv, rowId);
        this.props.OnModify(newCsv);
    }
    RemoveRow(rowId) {
        const newCsv = CsvOp_1.editorCsvOp.MutableRemove(this.props.Csv, rowId);
        this.props.OnModify(newCsv);
    }
    MoveRow(rowId, isUp) {
        const csv = this.props.Csv;
        if (!CsvOp_1.editorCsvOp.CanMove(csv, rowId, isUp)) {
            (0, Log_1.log)(`CsvView ${csv.Name} can not move ${isUp ? 'up' : 'down'} for row ${rowId}`);
            return;
        }
        const newCsv = CsvOp_1.editorCsvOp.MutableMove(this.props.Csv, rowId, isUp);
        this.props.OnModify(newCsv);
    }
    RenderFilter(fieldTypes) {
        const gridRowId = this.CurrGridRowId++;
        const filterTexts = this.props.FilterTexts;
        const result = fieldTypes.map((field, index) => {
            const slot = { Row: gridRowId, Column: index };
            const text = index < filterTexts.length ? filterTexts[index] : '';
            return (React.createElement(react_umg_1.HorizontalBox, { Slot: slot, key: field.Name },
                React.createElement(CommonComponent_1.EditorBox, { Text: text, Tip: '输入过滤字符串,将只显示对应的行', Width: index === 0 ? 30 : 60, OnChange: (text) => {
                        this.props.OnModifyFilterTexts(index, text);
                    } }),
                React.createElement(CommonComponent_1.Btn, { Text: 'C', Tip: '清空过滤内容', OnClick: () => {
                        this.props.OnModifyFilterTexts(index, '');
                    } })));
        });
        return result;
    }
    RenderHead(fieldTypes) {
        const gridRowId = this.CurrGridRowId++;
        const result = fieldTypes.map((field, index) => {
            const slot = { Row: gridRowId, Column: index };
            if (CsvOp_1.editorCsvOp.IsIndexField(field)) {
                return (React.createElement(react_umg_1.HorizontalBox, { key: field.Name, Slot: slot },
                    React.createElement(CommonComponent_1.Btn, { Text: '+', Width: 28, OnClick: () => {
                            this.InsertRow(this.props.Csv.Rows.length);
                        } }),
                    React.createElement(CommonComponent_1.SlotText, { Text: field.CnName })));
            }
            return (React.createElement(react_umg_1.HorizontalBox, { key: field.Name, Slot: slot },
                React.createElement(CommonComponent_1.SlotText, { Text: ` ${field.CnName} ` })));
        });
        return result;
    }
    ModifyValue(rowId, fieldName, value) {
        const newCsv = (0, immer_1.default)(this.props.Csv, (draft) => {
            draft.Rows[rowId][fieldName] = value;
        });
        this.props.OnModify(newCsv);
    }
    IsInFilter(fieldTypes, row) {
        const filterTexts = this.props.FilterTexts;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < fieldTypes.length; i++) {
            const field = fieldTypes[i];
            const filter = filterTexts[i];
            const value = row[field.Name].toString();
            if (value && !value.includes(filter)) {
                return false;
            }
        }
        return true;
    }
    RenderRow(fieldTypes, row, rowId) {
        if (!this.IsInFilter(fieldTypes, row)) {
            return [];
        }
        const csv = this.props.Csv;
        const gridRowId = this.CurrGridRowId++;
        const result = fieldTypes.map((field, index) => {
            const slot = { Row: gridRowId, Column: index };
            if (!field.Meta) {
                return (React.createElement(CommonComponent_1.Text, { Text: '未知类型', Tip: '请配置对应Csv字段的Meta成员', Slot: slot, key: `${rowId}-${index}` }));
            }
            // 索引字段不能直接修改
            if (CsvOp_1.editorCsvOp.IsIndexField(field)) {
                return (React.createElement(react_umg_1.HorizontalBox, { Slot: slot, key: `${rowId}-${index}` },
                    React.createElement(ContextBtn_1.ContextBtn, { Commands: ['上插', '下插', '移除', '上移', '下移'], OnCommand: (cmd) => {
                            this.OnContextCommand(rowId, cmd);
                        } }),
                    React.createElement(CommonComponent_1.SlotText, { Text: row[field.Name].toString() })));
            }
            // 重复的字段提示红色
            const value = row[field.Name].toString();
            let color = undefined;
            if (field.Filter === '1') {
                const colValues = this.IndexColumes.get(field.Name);
                if (colValues.find((e, id) => e === value && rowId !== id)) {
                    color = '#8B0000 dark red';
                }
            }
            return (React.createElement(react_umg_1.SizeBox, { Slot: slot, key: `${rowId}-${index}` },
                React.createElement(Context_1.csvCellContext.Provider, { value: { RowId: rowId, ColId: index, Csv: csv } },
                    React.createElement(Public_1.Any, { Color: color, Value: row[field.Name], Scheme: CsvScheme_1.csvScheme.GetSchme(field.Meta), OnModify: (value, type) => {
                            this.ModifyValue(rowId, field.Name, value);
                        } }))));
        });
        return result;
    }
    RenderRows(fieldTypes, rows) {
        const result = [];
        rows.forEach((row, id) => {
            result.push(...this.RenderRow(fieldTypes, row, id));
        });
        return result;
    }
    UpdateIndexCols() {
        this.IndexColumes.clear();
        const indexNames = [];
        this.props.Csv.FiledTypes.forEach((fieldType) => {
            if (fieldType.Filter === '1') {
                this.IndexColumes.set(fieldType.Name, []);
                indexNames.push(fieldType.Name);
            }
        });
        this.props.Csv.Rows.forEach((row) => {
            indexNames.forEach((name) => {
                const value = row[name];
                this.IndexColumes.get(name).push(value);
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const csv = this.props.Csv;
        this.CurrGridRowId = 0;
        this.UpdateIndexCols();
        return (React.createElement(react_umg_1.GridPanel, null,
            this.RenderFilter(csv.FiledTypes),
            this.RenderHead(csv.FiledTypes),
            this.RenderRows(csv.FiledTypes, csv.Rows)));
    }
}
exports.CsvView = CsvView;
//# sourceMappingURL=CsvView.js.map