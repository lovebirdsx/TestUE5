/* eslint-disable spellcheck/spell-checker */
import {
    IActionInfo,
    IChangeRandomState,
    IChangeState,
    IFlowInfo,
    IShowTalk,
    IStateInfo,
} from '../../../Game/Flow/Action';
import { StateOp } from './State';

export class FlowOp {
    public static CreateState(flow: IFlowInfo): IStateInfo {
        const state: IStateInfo = {
            Name: `状态${flow.StateGenId}`,
            Actions: [],
            Id: flow.StateGenId,
        };
        return state;
    }

    public static Fix(flow: IFlowInfo, versionFrom: number, versionTo: number): void {
        flow.States.forEach((state): void => {
            StateOp.Fix(state, versionFrom, versionTo);
        });

        // 确保每一个切换状态指令的stateId合法
        const allStateIds = flow.States.map((state) => state.Id);
        flow.States.forEach((state) => {
            StateOp.ForeachActions(state, (action) => {
                if (action.Name === 'ChangeState') {
                    const changeState = action.Params as IChangeState;
                    if (!allStateIds.includes(changeState.StateId)) {
                        changeState.StateId = allStateIds[0];
                    }
                } else if (action.Name === 'ChangeRandomState') {
                    const changeRandomState = action.Params as IChangeRandomState;
                    const stateIds = changeRandomState.StateIds;
                    for (let i = stateIds.length - 1; i >= 0; i--) {
                        const stateId = stateIds[i];
                        if (!allStateIds.includes(stateId)) {
                            stateIds.splice(i, 1);
                        }
                    }

                    if (stateIds.length < 0) {
                        stateIds.push(allStateIds[0]);
                    }
                }
            });
        });
    }

    private static GetDestinationStatesImpl(
        flow: IFlowInfo,
        actions: IActionInfo[],
        result: string[],
    ): void {
        if (!actions) {
            return;
        }

        actions.forEach((action) => {
            if (action.Name === 'ShowTalk') {
                const showTalk = action.Params as IShowTalk;
                showTalk.TalkItems.forEach((item) => {
                    this.GetDestinationStatesImpl(flow, item.Actions, result);
                    if (item.Options) {
                        item.Options.forEach((option) => {
                            this.GetDestinationStatesImpl(flow, option.Actions, result);
                        });
                    }
                });
            } else if (action.Name === 'ChangeState') {
                const changeState = action.Params as IChangeState;
                const state = flow.States.find((e) => e.Id === changeState.StateId);
                if (state && !result.includes(state.Name)) {
                    result.push(state.Name);
                }
            } else if (action.Name === 'ChangeRandomState') {
                const changeRandomState = action.Params as IChangeRandomState;
                const stateIds = changeRandomState.StateIds;
                stateIds.forEach((id: number) => {
                    const state = flow.States.find((e) => e.Id === id);
                    if (state && !result.includes(state.Name)) {
                        result.push(state.Name);
                    }
                });
            }
        });
    }

    public static GetDestinationStates(flow: IFlowInfo, state: IStateInfo): string[] {
        const result: string[] = [];
        this.GetDestinationStatesImpl(flow, state.Actions, result);
        return result;
    }
}
