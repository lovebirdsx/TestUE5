/* eslint-disable spellcheck/spell-checker */
import { Class } from 'ue';

import { TComponentClass } from '../../Common/Entity';
import { IPlayFlow } from '../Flow/Action';

export interface IFlowComponent {
    InitState: IPlayFlow;
}

export type TComponentsState = Record<string, Record<string, unknown>>;

export function parseComponentsState(json: string): TComponentsState {
    if (!json) {
        return {};
    }
    return JSON.parse(json) as TComponentsState;
}

export interface ITsEntityData {
    Guid: string;
    ComponentsStateJson: TComponentsState;
}

export interface ITsEntity {
    Guid: string;
    ComponentsStateJson: string;
    Name: string;
    Interact: (player: ITsPlayer) => Promise<void>;
    GetClass: () => Class;
    GetComponentClasses: () => TComponentClass[];
    Init: () => void;
    Start: () => void;
    Destroy: () => void;
}

export type TEntityPureData = ITsEntityData & Record<string, unknown>;

export interface ITsTrigger {
    MaxTriggerTimes: number;
    TriggerActionsJson: string;
}

export interface ITsPlayer {
    Name: string;
}
