"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerEntity = void 0;
const ActionRunnerComponent_1 = require("../Component/ActionRunnerComponent");
const Interface_1 = require("../Interface");
class TriggerEntity extends Interface_1.Entity {
    MaxTriggerTimes;
    ActionInfos;
    ActionRunner;
    RunnerHandler;
    Init() {
        this.ActionRunner = this.GetComponent(ActionRunnerComponent_1.ActionRunnerComponent);
        this.RunnerHandler = this.ActionRunner.SpawnHandler(this.ActionInfos);
    }
    async Interact() {
        // await this.Flow.Run();
    }
}
exports.TriggerEntity = TriggerEntity;
//# sourceMappingURL=TriggerEntity.js.map