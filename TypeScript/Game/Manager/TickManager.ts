/* eslint-disable spellcheck/spell-checker */
import { error } from '../../Common/Misc/Log';
import { getTotalSecond } from '../../Common/Misc/Util';
import { gameContext, ITickable, ITickManager, ITimeCall } from '../Interface';
import { IManager } from './Interface';

export class TickManager implements IManager, ITickManager {
    private readonly TickList: ITickable[] = [];

    private readonly TickSet = new Set<ITickable>();

    private readonly TimeCallList: ITimeCall[] = [];

    private readonly TimeCallSet = new Set<ITimeCall>();

    private readonly AddQueue: ITickable[] = [];

    private readonly RemoveQueue: ITickable[] = [];

    private readonly DelayCalls: (() => void)[] = [];

    public constructor() {
        gameContext.TickManager = this;
    }

    public get TickCount(): number {
        return this.TickList.length;
    }

    public HasTick(tickable: ITickable): boolean {
        if (this.TickSet.has(tickable)) {
            return true;
        }
        return false;
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

    public HasTimeCall(timeCall: ITimeCall): boolean {
        if (this.TimeCallSet.has(timeCall)) {
            return true;
        }
        return false;
    }

    public AddTimeCall(timeCall: ITimeCall): void {
        if (this.TimeCallSet.has(timeCall)) {
            throw new Error(`Add duplicate timeCall ${timeCall.Name}`);
        }
        this.TimeCallSet.add(timeCall);

        this.TimeCallList.push(timeCall);
        this.TimeCallList.sort((a: ITimeCall, b: ITimeCall) => {
            return a.CallTime - b.CallTime;
        });
    }

    public RemoveTimeCall(timeCall: ITimeCall): void {
        if (!this.TimeCallSet.has(timeCall)) {
            error(`Remove not exist timeCall`);
        }
        this.TimeCallSet.delete(timeCall);
        this.TimeCallList.splice(this.TimeCallList.indexOf(timeCall), 1);
    }

    public Init(): void {}

    public Exit(): void {}

    public Tick(deltaTime: number): void {
        if (this.AddQueue.length > 0) {
            this.TickList.push(...this.AddQueue.splice(0));
        }

        if (this.RemoveQueue.length > 0) {
            const tickables = this.RemoveQueue.splice(0);
            tickables.forEach((tick) => {
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

        if (this.TimeCallList.length > 0) {
            const removeTimeCall: ITimeCall[] = [];
            const second = getTotalSecond();
            for (const timeCall of this.TimeCallList) {
                if (timeCall.CallTime < second) {
                    timeCall.TimeCall();
                    removeTimeCall.push(timeCall);
                } else {
                    break;
                }
            }
            if (removeTimeCall.length > 0) {
                removeTimeCall.forEach((timeCall) => {
                    this.RemoveTimeCall(timeCall);
                });
            }
        }
    }
}
