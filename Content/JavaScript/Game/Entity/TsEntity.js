"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Log_1 = require("../../Editor/Common/Log");
const TsEntityComponent_1 = require("./TsEntityComponent");
class TsEntity extends ue_1.Actor {
    // @no-blueprint
    ComponentMap;
    // @no-blueprint
    GenComponentMap() {
        const result = new Map();
        for (let i = 0; i < this.BlueprintCreatedComponents.Num(); i++) {
            const c = this.BlueprintCreatedComponents.Get(i);
            if (c instanceof TsEntityComponent_1.default) {
                // 此处不能使用c.constructor.name, Puerts中返回为空
                result.set(c.GetName(), c);
            }
        }
        return result;
    }
    // PureTs中 GetComponentByClass不能正确返回TS创建的Component,故而自己写一个更为通用的
    // @no-blueprint
    GetComponent(classObj) {
        if (!this.ComponentMap) {
            // ComponentMap不能在Constructor中初始化,因为Constructor中调用时,组件还未创建完毕
            // 也不适合在ReceiveBeginPlay中初始化,这样就必须依赖子类的ReceiveBeginPlay要后调用
            // 此处采用惰性初始化,是最好的做法
            this.ComponentMap = this.GenComponentMap();
        }
        const result = this.ComponentMap.get(classObj.name);
        if (!result) {
            (0, Log_1.error)(`${this.GetName()} can not get component for ${classObj.name}`);
        }
        return result;
    }
    // @no-blueprint
    async Interact(player) {
        (0, Log_1.error)(`Interact is not implement for ${this.GetName()}`);
        return Promise.resolve();
    }
}
exports.default = TsEntity;
//# sourceMappingURL=TsEntity.js.map