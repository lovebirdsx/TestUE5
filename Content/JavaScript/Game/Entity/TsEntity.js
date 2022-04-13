"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Log_1 = require("../../Editor/Common/Log");
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
        (0, Log_1.error)(`${this.GetName()} can not get component for ${classObj.name}`);
        return undefined;
    }
    // @no-blueprint
    async Interact(player) {
        (0, Log_1.error)(`Interact is not implement for ${this.GetName()}`);
        return Promise.resolve();
    }
}
exports.default = TsEntity;
//# sourceMappingURL=TsEntity.js.map