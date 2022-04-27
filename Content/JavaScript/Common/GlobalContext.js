"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalContexts = exports.GlobalContexts = void 0;
class GlobalContexts {
    ContextMap = new Map();
    Slots = [];
    SlotHandle = 0;
    Push(scheme, t) {
        if (this.ContextMap.has(scheme)) {
            throw new Error(`Can not push again for same scheme ${scheme.Name}`);
        }
        const slot = {
            Handle: this.SlotHandle++,
            Scheme: scheme,
        };
        this.ContextMap.set(scheme, t);
        this.Slots.push(slot);
        return slot.Handle;
    }
    Pop(handler) {
        const slotIndex = this.Slots.findIndex((slot) => slot.Handle === handler);
        if (slotIndex < 0) {
            throw new Error(`Remove no exist handle ${handler}`);
        }
        const [slot] = this.Slots.splice(slotIndex, 1);
        this.ContextMap.delete(slot.Scheme);
    }
    Get(scheme) {
        const result = this.ContextMap.get(scheme);
        if (!result) {
            throw new Error(`No value for scheme ${scheme.Name}`);
        }
        return result;
    }
}
exports.GlobalContexts = GlobalContexts;
exports.globalContexts = new GlobalContexts();
//# sourceMappingURL=GlobalContext.js.map