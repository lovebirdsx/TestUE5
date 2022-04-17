import { Class } from 'ue';

import { IPlayFlow } from '../Flow/Action';

export interface IFlowComponent {
    InitState: IPlayFlow;
}

export interface ITsEntity {
    ComponentsStateJson: string;
    Interact: (player: ITsPlayer) => Promise<void>;
    Name: string;
    GetClass: () => Class;
}

export interface ITsTrigger {
    MaxTriggerTimes: number;
    TriggerActionsJson: string;
}

export interface ITsPlayer {
    Name: string;
}

export interface IComponentsState {
    Components: Record<string, Record<string, unknown>>;
}

export function parseComponentsState(json: string): IComponentsState {
    if (!json) {
        return {
            Components: {},
        };
    }
    return JSON.parse(json) as IComponentsState;
}
