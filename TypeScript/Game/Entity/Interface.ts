/* eslint-disable spellcheck/spell-checker */
import { Class } from 'ue';

import { TComponentClass } from '../../Common/Entity';
import { IPlayFlow } from '../Flow/Action';

export interface IFlowComponent {
    InitState: IPlayFlow;
}

export interface ITsEntityData {
    Guid: string;
    ComponentsStateJson: string;
}

export interface ITsEntity extends ITsEntityData {
    Name: string;
    Interact: (player: ITsPlayer) => Promise<void>;
    GetClass: () => Class;
    GetComponentClasses: () => TComponentClass[];
}

export type TEntityPureData = ITsEntityData & Record<string, unknown>;

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
