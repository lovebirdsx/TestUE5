"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Entity_1 = require("../../Common/Entity");
const Log_1 = require("../../Common/Log");
const EntityRegistry_1 = require("./EntityRegistry");
const Interface_1 = require("./Interface");
// import TsEntityComponent from './TsEntityComponent';
// type TComponentMap = Map<string, TsEntityComponent>;
class TsEntity extends ue_1.Actor {
    ComponentsStateJson;
    // @no-blueprint
    // private ComponentMap: TComponentMap;
    // @no-blueprint
    Entity;
    get Name() {
        return this.GetName();
    }
    // @no-blueprint
    // private GenComponentMap(): TComponentMap {
    //     const result = new Map() as TComponentMap;
    //     for (let i = 0; i < this.BlueprintCreatedComponents.Num(); i++) {
    //         const c = this.BlueprintCreatedComponents.Get(i);
    //         if (c instanceof TsEntityComponent) {
    //             // 此处不能使用c.constructor.name, Puerts中返回为空
    //             result.set(c.GetName(), c);
    //         }
    //     }
    //     return result;
    // }
    GenEntity() {
        const entity = new Entity_1.Entity(this.GetOwner().GetName());
        const componentsState = (0, Interface_1.parseComponentsState)(this.ComponentsStateJson);
        const tsClass = (0, Class_1.getTsClassByUeClass)(this.GetClass());
        const componentClasses = EntityRegistry_1.entityRegistry.GetComponents(tsClass);
        componentClasses.forEach((componentClass) => {
            const component = entity.AddComponentC(componentClass);
            const data = componentsState.Components[componentClass.name];
            if (data) {
                Object.assign(component, data);
            }
        });
        return entity;
    }
    // PureTs中 GetComponentByClass不能正确返回TS创建的Component,故而自己写一个更为通用的
    // @no-blueprint
    // public GetComponent<T extends TsEntityComponent>(classObj: new () => T): T {
    //     if (!this.ComponentMap) {
    //         // ComponentMap不能在Constructor中初始化,因为Constructor中调用时,组件还未创建完毕
    //         // 也不适合在ReceiveBeginPlay中初始化,这样就必须依赖子类的ReceiveBeginPlay要后调用
    //         // 此处采用惰性初始化,是最好的做法
    //         this.ComponentMap = this.GenComponentMap();
    //     }
    //     const result = this.ComponentMap.get(classObj.name) as T;
    //     if (!result) {
    //         error(`${this.GetName()} can not get component for ${classObj.name}`);
    //     }
    //     return result;
    // }
    // @no-blueprint
    async Interact(player) {
        (0, Log_1.error)(`Interact is not implement for ${this.GetName()}`);
        return Promise.resolve();
    }
}
__decorate([
    (0, ue_1.edit_on_instance)()
], TsEntity.prototype, "ComponentsStateJson", void 0);
exports.default = TsEntity;
//# sourceMappingURL=TsEntity.js.map