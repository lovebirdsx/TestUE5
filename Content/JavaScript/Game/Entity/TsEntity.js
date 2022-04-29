"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsEntity = exports.entityComponentClasses = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Interface_1 = require("../Interface");
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
    // @no-blueprint
    Init(context) {
        this.Entity = (0, Interface_1.genEntity)(this, context);
        this.Entity.Init();
    }
    // @no-blueprint
    Load() {
        this.Entity.Load();
    }
    // @no-blueprint
    Start() {
        this.Entity.Start();
    }
    // @no-blueprint
    Destroy() {
        this.Entity.Destroy();
    }
    // @no-blueprint
    GetComponentClasses() {
        return exports.entityComponentClasses;
    }
}
__decorate([
    (0, ue_1.edit_on_instance)()
], TsEntity.prototype, "Guid", void 0);
__decorate([
    (0, ue_1.edit_on_instance)()
], TsEntity.prototype, "ComponentsStateJson", void 0);
exports.TsEntity = TsEntity;
exports.default = TsEntity;
//# sourceMappingURL=TsEntity.js.map