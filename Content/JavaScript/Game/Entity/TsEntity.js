"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityComponentClasses = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Entity_1 = require("../../Common/Entity");
const Log_1 = require("../../Common/Log");
const Interface_1 = require("./Interface");
// 没有做成TsEntity的static成员变量，是因为Puerts不支持
exports.entityComponentClasses = [];
class TsEntity extends ue_1.Actor {
    Guid;
    ComponentsStateJson;
    // @no-blueprint
    Entity;
    get Name() {
        return this.GetName();
    }
    ReceiveBeginPlay() {
        if (!this.Entity) {
            this.Entity = this.GenEntity();
            this.Entity.Init();
            this.Entity.Start();
        }
    }
    // @no-blueprint
    GetComponentClasses() {
        return exports.entityComponentClasses;
    }
    // @no-blueprint
    GenEntity() {
        const entity = new Entity_1.Entity(this.GetName());
        const componentsState = (0, Interface_1.parseComponentsState)(this.ComponentsStateJson);
        const componentClasses = this.GetComponentClasses();
        componentClasses.forEach((componentClass) => {
            const component = entity.AddComponentC(componentClass);
            const data = componentsState.Components[componentClass.name];
            if (data) {
                Object.assign(component, data);
            }
        });
        return entity;
    }
    // @no-blueprint
    async Interact(player) {
        (0, Log_1.error)(`Interact is not implement for ${this.GetName()}`);
        return Promise.resolve();
    }
}
__decorate([
    (0, ue_1.edit_on_instance)()
], TsEntity.prototype, "Guid", void 0);
__decorate([
    (0, ue_1.edit_on_instance)()
], TsEntity.prototype, "ComponentsStateJson", void 0);
exports.default = TsEntity;
//# sourceMappingURL=TsEntity.js.map