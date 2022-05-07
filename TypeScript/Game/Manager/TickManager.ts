import { error } from '../../Common/Log';
import { gameContext, ITickable, ITickManager } from '../Interface';
import { IManager } from './Interface';

export class TickManager implements IManager, ITickManager {
    private readonly TickList: ITickable[] = [];

    private readonly TickSet = new Set<ITickable>();

    private readonly AddQueue: ITickable[] = [];

    private readonly RemoveQueue: ITickable[] = [];

    private readonly DelayCalls: (() => void)[] = [];

    public constructor() {
        gameContext.TickManager = this;
    }

    public AddTick(tickable: ITickable): void {
        if (this.TickSet.has(tickable)) {
            throw new Error(`Add duplicate tick ${tickable.Name}`);
        }

        this.TickSet.add(tickable);

        this.AddQueue.push(tickable);
    }

    public RemoveTick(tickable: ITickable): void {
        if (!this.TickSet.has(tickable)) {
            error(`Remove not exist tick`);
        }

        this.TickSet.delete(tickable);

        this.RemoveQueue.push(tickable);
    }

    public AddDelayCall(call: () => void): void {
        this.DelayCalls.push(call);
    }

    public Init(): void {}

    public Exit(): void {}

    public Tick(deltaTime: number): void {
        if (this.AddQueue.length > 0) {
            this.TickList.push(...this.AddQueue);
        }

        if (this.RemoveQueue.length > 0) {
            this.RemoveQueue.forEach((tick) => {
                this.TickList.splice(this.TickList.indexOf(tick), 1);
            });
        }

        if (this.DelayCalls.length > 0) {
            const calls = this.DelayCalls.splice(0);
            calls.forEach((call) => {
                call();
            });
        }

        this.TickList.forEach((tick) => {
            tick.Tick(deltaTime);
        });
    }
}
