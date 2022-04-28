import { error } from '../../Common/Log';
import { IGameContext, ITickable, ITickManager } from '../Interface';
import { IManager } from './Interface';

export class TickManager implements IManager, ITickManager {
    private readonly TickList: ITickable[] = [];

    private readonly TickSet = new Set<ITickable>();

    private readonly AddQueue: ITickable[] = [];

    private readonly RemoveQueue: ITickable[] = [];

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

    public Init(context: IGameContext): void {}

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

        this.TickList.forEach((tick) => {
            tick.Tick(deltaTime);
        });
    }
}
