"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ue_1 = require("ue");
const Log_1 = require("../../Editor/Common/Log");
class TsActionRunner extends ue_1.ActorComponent {
    //@no-blueprint
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
    //@no-blueprint
    ExecuteOne(action) {
        if (action.Async) {
            this.ExecuteAsync(action);
        }
        else {
            this.ExecuteSync(action);
        }
    }
    //@no-blueprint
    ExecuteAsync(action) {
        throw new Error('Method not implemented.');
    }
    //@no-blueprint
    ExecuteSync(action) {
        throw new Error('Method not implemented.');
    }
}
exports.default = TsActionRunner;
//# sourceMappingURL=TsActionRunner.js.map