"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Log_1 = require("../../Editor/Common/Log");
class TsActionRunner extends ue_1.ActorComponent {
    Constructor() {
        const owner = this.GetOwner();
        Log_1.log(`ActionRunner's name is ${this.GetName()} owner is ${owner ? owner.GetName() : 'null'}`);
    }
    ExecuteJson(json) {
        // todo
    }
    Execute(actions) {
        if (this.IsRunning) {
            Log_1.error(`${this.GetOwner().GetName()} can not run actions again`);
            return;
        }
        this.IsRunning = true;
        actions.forEach((action, id) => {
            this.ExecuteOne(action);
        });
        this.IsRunning = false;
    }
    ExecuteOne(action) {
        if (action.Async) {
            this.ExecuteAsync(action);
        }
        else {
            this.ExecuteSync(action);
        }
    }
    ExecuteAsync(action) {
        throw new Error('Method not implemented.');
    }
    ExecuteSync(action) {
        throw new Error('Method not implemented.');
    }
}
__decorate([
    ue_1.no_blueprint()
], TsActionRunner.prototype, "IsRunning", void 0);
__decorate([
    ue_1.no_blueprint()
], TsActionRunner.prototype, "ExecuteJson", null);
__decorate([
    ue_1.no_blueprint()
], TsActionRunner.prototype, "Execute", null);
__decorate([
    ue_1.no_blueprint()
], TsActionRunner.prototype, "ExecuteOne", null);
__decorate([
    ue_1.no_blueprint()
], TsActionRunner.prototype, "ExecuteAsync", null);
__decorate([
    ue_1.no_blueprint()
], TsActionRunner.prototype, "ExecuteSync", null);
exports.default = TsActionRunner;
//# sourceMappingURL=TsActionRunner.js.map