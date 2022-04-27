"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = require("../../Common/Entity");
class StateComponent extends Entity_1.Component {
    StateMap = new Map();
    GetState(key) {
        return this.StateMap.get(key);
    }
    SetState(key, value) {
        this.StateMap.set(key, value);
    }
    GenSnapshot() {
        return Object.fromEntries(this.StateMap.entries());
    }
    ApplySnapshot(snapshot) {
        this.StateMap.clear();
        Object.entries(snapshot).forEach(([key, value]) => {
            this.StateMap.set(key, value);
        });
    }
}
exports.default = StateComponent;
//# sourceMappingURL=StateComponent.js.map