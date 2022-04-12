"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvView = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const CsvLoader_1 = require("../CsvLoader");
const Log_1 = require("../Log");
const Any_1 = require("./Any");
const CommonComponent_1 = require("./CommonComponent");
const ContextBtn_1 = require("./ContextBtn");
class CsvView extends React.Component {
    OnContextCommand(rowId, cmd) {
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
                (0, Log_1.error)(`Unknown CsvView context command [${cmd}]`);
                break;
        }
    }
    InsertRow(rowId) {
        const newCsv = CsvLoader_1.Csv.MutableInsert(this.props.Csv, rowId);
        this.props.OnModify(newCsv);
    }
    RemoveRow(rowId) {
        const newCsv = CsvLoader_1.Csv.MutableRemove(this.props.Csv, rowId);
        this.props.OnModify(newCsv);
    }
    MoveRow(rowId, isUp) {
        const csv = this.props.Csv;
        if (!CsvLoader_1.Csv.CanMove(csv, rowId, isUp)) {
            (0, Log_1.log)(`CsvView ${csv.Name} can not move ${isUp ? 'up' : 'down'} for row ${rowId}`);
            return;
        }
        const newCsv = CsvLoader_1.Csv.MutableMove(this.props.Csv, rowId, isUp);
        this.props.OnModify(newCsv);
    }
    RenderHead(fieldTypes) {
        const result = fieldTypes.map((field, index) => {
            const slot = { Row: 0, Column: index };
            if (CsvLoader_1.Csv.IsIndexField(field)) {
                return (React.createElement(react_umg_1.HorizontalBox, { key: field.Name, Slot: slot },
                    React.createElement(CommonComponent_1.Btn, { Text: '+', Width: 28, OnClick: () => {
                            this.InsertRow(this.props.Csv.Rows.length);
                        } }),
                    React.createElement(CommonComponent_1.SlotText, { Text: field.CnName })));
            }
            return (React.createElement(react_umg_1.HorizontalBox, { key: field.Name, Slot: slot },
                React.createElement(CommonComponent_1.SlotText, { Text: field.CnName })));
        });
        return result;
    }
    ModifyValue(rowId, fieldName, value) {
        const newCsv = (0, immer_1.default)(this.props.Csv, (draft) => {
            draft.Rows[rowId][fieldName] = value;
        });
        this.props.OnModify(newCsv);
    }
    RenderRow(fieldTypes, row, rowId) {
        const result = fieldTypes.map((field, index) => {
            const slot = { Row: rowId + 1, Column: index };
            if (!field.TypeData) {
                return (React.createElement(CommonComponent_1.Text, { Text: '未知类型', Tip: '请配置对应Csv字段的TypeData成员', Slot: slot, key: `${rowId}-${index}` }));
            }
            // 索引字段不能直接修改
            if (CsvLoader_1.Csv.IsIndexField(field)) {
                return (React.createElement(react_umg_1.HorizontalBox, { Slot: slot, key: `${rowId}-${index}` },
                    React.createElement(ContextBtn_1.ContextBtn, { Commands: ['insert', 'remove', 'moveUp', 'moveDown'], OnCommand: (cmd) => {
                            this.OnContextCommand(rowId, cmd);
                        } }),
                    React.createElement(CommonComponent_1.SlotText, { Text: row[field.Name].toString() })));
            }
            return (React.createElement(react_umg_1.SizeBox, { Slot: slot, key: `${rowId}-${index}` },
                React.createElement(Any_1.Any, { Value: row[field.Name], Type: field.TypeData, OnModify: (value, type) => {
                        this.ModifyValue(rowId, field.Name, value);
                    } })));
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const csv = this.props.Csv;
        return (React.createElement(react_umg_1.GridPanel, null,
            this.RenderHead(csv.FiledTypes),
            this.RenderRows(csv.FiledTypes, csv.Rows)));
    }
}
exports.CsvView = CsvView;
//# sourceMappingURL=CsvView.js.map