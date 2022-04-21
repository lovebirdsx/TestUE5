"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalContexts = void 0;
class GlobalContexts {
    ContextMap = new Map();
    Slots = [];
    SlotHandle = 0;
    Set(schemeClass, t) {
        const slot = {
            Handle: this.SlotHandle++,
            SchemeClass: schemeClass,
        };
        this.ContextMap.set(schemeClass, t);
        this.Slots.push(slot);
        return slot.Handle;
    }
    Remove(handler) {
        const slotIndex = this.Slots.findIndex((slot) => slot.Handle === handler);
        if (slotIndex < 0) {
            throw new Error(`Remove no exist handle ${handler}`);
        }
        const [slot] = this.Slots.splice(slotIndex, 1);
        this.ContextMap.delete(slot.SchemeClass);
    }
    Get(schemeClass) {
        return this.ContextMap.get(schemeClass);
    }
}
exports.GlobalContexts = GlobalContexts;
//# sourceMappingURL=GlobalContext.js.map