/* eslint-disable spellcheck/spell-checker */
import { Rotator, Vector } from 'ue';

import { Component } from '../Interface';

function vectorToArray(vec: Vector): number[] {
    return [vec.X, vec.Y, vec.Z];
}

function arrayToVector(array: number[]): Vector {
    return new Vector(array[0], array[1], array[2]);
}

function genRotationArray(vec: Vector): number[] {
    if (vec.X === 0 && vec.Y === 0 && vec.Z === 0) {
        return undefined;
    }

    return vectorToArray(vec);
}

class StateComponent extends Component {
    private readonly StateMap = new Map<string, unknown>();

    public GetState<T>(key: string): T {
        return this.StateMap.get(key) as T;
    }

    // 如果value为undefined,则表示删除对应的key状态
    public SetState<T>(key: string, value: T): void {
        if (value !== undefined) {
            this.StateMap.set(key, value);
        } else {
            this.StateMap.delete(key);
        }
    }

    public RecordPosition(): void {
        const posVec = this.Entity.Actor.K2_GetActorLocation();
        this.SetState('Pos', vectorToArray(posVec));
    }

    public ApplyPosition(): void {
        const posArray = this.GetState<number[]>('Pos');
        if (posArray) {
            const pos = arrayToVector(posArray);
            this.Entity.Actor.K2_SetActorLocation(pos, false, undefined, false);
        }
    }

    public RecordRotation(): void {
        const rotator = this.Entity.Actor.K2_GetActorRotation();
        const rotation = rotator.Euler();
        const rotationArray = genRotationArray(rotation);
        this.SetState('Rot', rotationArray);
    }

    public ApplyRotation(): void {
        const rotationArray = this.GetState<number[]>('Rot');
        if (rotationArray) {
            const rotation = arrayToVector(rotationArray);
            const rotator = Rotator.MakeFromEuler(rotation);
            this.Entity.Actor.K2_SetActorRotation(rotator, false);
        }
    }

    public GenSnapshot(): Record<string, unknown> {
        return Object.fromEntries(this.StateMap.entries());
    }

    public ApplySnapshot(snapshot: Record<string, unknown>): void {
        this.StateMap.clear();
        Object.entries(snapshot).forEach(([key, value]) => {
            this.StateMap.set(key, value);
        });
    }
}

export default StateComponent;
