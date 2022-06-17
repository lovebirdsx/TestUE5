import { Scheme } from './Type';

type TContextHandler = number;

interface IContextSlot {
    Handle: TContextHandler;
    Scheme: Scheme;
}

export class GlobalContexts {
    private readonly ContextMap = new Map<Scheme, unknown>();

    private readonly Slots: IContextSlot[] = [];

    private SlotHandle = 0;

    public Push<T>(scheme: Scheme<T>, t: T): TContextHandler {
        if (this.ContextMap.has(scheme)) {
            throw new Error(`Can not push again for same scheme ${scheme.Name}`);
        }
        const slot: IContextSlot = {
            Handle: this.SlotHandle++,
            Scheme: scheme,
        };
        this.ContextMap.set(scheme as Scheme, t);
        this.Slots.push(slot);
        return slot.Handle;
    }

    public Pop(handler: TContextHandler): void {
        const slotIndex = this.Slots.findIndex((slot) => slot.Handle === handler);
        if (slotIndex < 0) {
            throw new Error(`Remove no exist handle ${handler}`);
        }

        const [slot] = this.Slots.splice(slotIndex, 1);
        this.ContextMap.delete(slot.Scheme);
    }

    public Get<T>(scheme: Scheme<T>): T {
        const result = this.ContextMap.get(scheme as Scheme) as T;
        if (!result) {
            throw new Error(`No value for scheme ${scheme.Name}`);
        }
        return result;
    }
}

export const globalContexts = new GlobalContexts();
