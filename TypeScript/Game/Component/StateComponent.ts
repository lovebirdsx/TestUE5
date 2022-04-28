import { Component } from '../Interface';

class StateComponent extends Component {
    private readonly StateMap = new Map<string, unknown>();

    public GetState<T>(key: string): T {
        return this.StateMap.get(key) as T;
    }

    public SetState<T>(key: string, value: T): void {
        this.StateMap.set(key, value);
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
