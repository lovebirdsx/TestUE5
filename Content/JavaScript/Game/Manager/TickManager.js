"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickManager = void 0;
const Log_1 = require("../../Common/Log");
class TickManager {
    TickList = [];
    TickSet = new Set();
    AddQueue = [];
    RemoveQueue = [];
    AddTick(tickable) {
        if (this.TickSet.has(tickable)) {
            throw new Error(`Add duplicate tick ${tickable.Name}`);
        }
        this.TickSet.add(tickable);
        this.AddQueue.push(tickable);
    }
    RemoveTick(tickable) {
        if (!this.TickSet.has(tickable)) {
            (0, Log_1.error)(`Remove not exist tick`);
        }
        this.TickSet.delete(tickable);
        this.RemoveQueue.push(tickable);
    }
    Init(context) { }
    Exit() { }
    Tick(deltaTime) {
        if (this.AddQueue.length > 0) {
            this.TickList.push(...this.AddQueue);
        }
        if (this.RemoveQueue.length > 0) {
            this.RemoveQueue.forEach((tick) => {
                this.TickList.splice(this.TickList.indexOf(tick), 1);
            });
        }
        this.TickList.forEach((tick) => {
            tick.Tick(deltaTime);
        });
    }
}
exports.TickManager = TickManager;
//# sourceMappingURL=TickManager.js.map