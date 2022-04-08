"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEditorContext = exports.Context = void 0;
const immer_1 = require("immer");
class Context {
    GetFun;
    OnModify;
    Set(getFun, onModify) {
        this.GetFun = getFun;
        this.OnModify = onModify;
    }
    Clear() {
        this.GetFun = undefined;
        this.OnModify = undefined;
    }
    Get() {
        if (!this.GetFun) {
            throw new Error('Context get must called after set');
        }
        return this.GetFun();
    }
    Modify(type, cb) {
        if (!this.GetFun) {
            throw new Error('Context modify must called after set');
        }
        const oldValue = this.GetFun();
        const newValue = (0, immer_1.default)(oldValue, (draft) => {
            cb(oldValue, draft);
        });
        if (newValue !== oldValue) {
            this.OnModify(newValue, type);
        }
    }
}
exports.Context = Context;
function createEditorContext() {
    return new Context();
}
exports.createEditorContext = createEditorContext;
//# sourceMappingURL=EditorContext.js.map