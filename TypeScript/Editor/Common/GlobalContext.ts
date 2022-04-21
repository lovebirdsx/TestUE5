import { TSchemeClass } from '../../Common/Type';

type TContextHandler = number;

interface IContextSlot {
    Handle: TContextHandler;

    SchemeClass: TSchemeClass;
}

export class GlobalContexts {
    private readonly ContextMap = new Map<TSchemeClass, unknown>();

    private readonly Slots: IContextSlot[] = [];

    private SlotHandle = 0;

    public Set<T>(schemeClass: TSchemeClass<T>, t: T): TContextHandler {
        const slot: IContextSlot = {
            Handle: this.SlotHandle++,
            SchemeClass: schemeClass as TSchemeClass,
        };
        this.ContextMap.set(schemeClass as TSchemeClass, t);
        this.Slots.push(slot);
        return slot.Handle;
    }

    public Remove(handler: TContextHandler): void {
        const slotIndex = this.Slots.findIndex((slot) => slot.Handle === handler);
        if (slotIndex < 0) {
            throw new Error(`Remove no exist handle ${handler}`);
        }

        const [slot] = this.Slots.splice(slotIndex, 1);
        this.ContextMap.delete(slot.SchemeClass);
    }

    public Get<T>(schemeClass: TSchemeClass<T>): T {
        return this.ContextMap.get(schemeClass as TSchemeClass) as T;
    }
}
