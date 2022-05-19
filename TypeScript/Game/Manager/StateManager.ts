/* eslint-disable spellcheck/spell-checker */
import { MyFileHelper } from 'ue';

import { log } from '../../Common/Log';
import { GameConfig } from '../Common/GameConfig';
import { IActionInfo } from '../Flow/Action';
import { gameContext, ISavedEntityState, IStateManager, TEntityState } from '../Interface';
import { IManager } from './Interface';

interface ILevelState {
    EntityStates: ISavedEntityState[];
}

export class StateManager implements IManager, IStateManager {
    private readonly EntityById = new Map<string, ISavedEntityState>();

    public constructor() {
        gameContext.StateManager = this;
    }

    private get SavePath(): string {
        return GameConfig.GetCurrentMapSavePath(gameContext.World);
    }

    public Init(): void {
        this.Load();
    }

    public Exit(): void {
        this.Save();
    }

    public GetState(id: string): ISavedEntityState {
        return this.EntityById.get(id);
    }

    public SetState(id: string, state: TEntityState): void {
        if (Object.keys(state).length <= 0) {
            this.EntityById.delete(id);
            return;
        }

        const saveEntityState: ISavedEntityState = {
            Id: id,
            Deleted: false,
            ...state,
        };
        this.EntityById.set(id, saveEntityState);
    }

    public PushDelayAction(id: string, actionInfo: IActionInfo): void {
        let state = this.EntityById.get(id);
        if (!state) {
            state = {
                Id: id,
                Deleted: false,
                DelayActions: [],
            };
        }

        if (!state.DelayActions) {
            state.DelayActions = [];
        }

        state.DelayActions.push(actionInfo);
        this.EntityById.set(id, state);

        log(`Push delay action ${JSON.stringify(actionInfo)} to ${id}`);
    }

    public MarkDelete(id: string): void {
        const saveEntityState: ISavedEntityState = {
            Id: id,
            Deleted: true,
        };
        this.EntityById.set(id, saveEntityState);
    }

    public DeleteState(id: string): void {
        this.EntityById.delete(id);
    }

    private Clear(): void {
        this.EntityById.clear();
    }

    public Load(): void {
        this.Clear();

        const content = MyFileHelper.Read(this.SavePath);
        if (!content) {
            return;
        }

        const state = JSON.parse(content) as ILevelState;
        if (state.EntityStates) {
            state.EntityStates.forEach((entityState) => {
                this.EntityById.set(entityState.Id, entityState);
            });
        }

        log(`Load state from ${this.SavePath}`);
    }

    public Save(): void {
        const states: ISavedEntityState[] = [];
        this.EntityById.forEach((state) => {
            states.push(state);
        });
        const levelState: ILevelState = {
            EntityStates: states,
        };

        MyFileHelper.Write(this.SavePath, JSON.stringify(levelState, undefined, 2));

        log(`Write state to ${this.SavePath}`);
    }
}
