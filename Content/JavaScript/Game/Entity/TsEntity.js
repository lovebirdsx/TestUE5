"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
class TsEntity extends ue_1.Actor {
    // PureTs中 GetComponentByClass不能正确返回TS创建的Component,故而自己写一个更为通用的
    // @no-blueprint
    GetComponentByTsClass(classObj) {
        for (let i = 0; i < this.BlueprintCreatedComponents.Num(); i++) {
            const c = this.BlueprintCreatedComponents.Get(i);
            if (c instanceof classObj) {
                return c;
            }
        }
        return undefined;
    }
}
exports.default = TsEntity;
//# sourceMappingURL=TsEntity.js.map