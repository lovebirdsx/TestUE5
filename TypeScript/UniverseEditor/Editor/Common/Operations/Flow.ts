/* eslint-disable spellcheck/spell-checker */
import {
    IActionInfo,
    IChangeRandomState,
    IChangeState,
    IFlowInfo,
    IShowTalk,
    IStateInfo,
} from '../../../Common/Interface/IAction';
import { warn } from '../../../Common/Misc/Log';
import { TFixResult } from '../Type';
import { stateOp } from './State';

class EditorFlowOp {
    private GenNewStateId(flow: IFlowInfo): number {
        let maxId = 0;
        flow.States.forEach((state) => {
            if (state.Id > maxId) {
                maxId = state.Id;
            }
        });
        return maxId + 1;
    }

    public CreateState(flow: IFlowInfo): IStateInfo {
        const stateId = this.GenNewStateId(flow);
        const state: IStateInfo = {
            Name: `状态${stateId}`,
            Actions: [],
            Id: stateId,
        };
        return state;
    }

    private GetDestinationStatesImpl(
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
            } else if (action.Name === 'ChangeState' || action.Name === 'ChangeBehaviorState') {
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

    public GetDestinationStates(flow: IFlowInfo, state: IStateInfo): string[] {
        const result: string[] = [];
        this.GetDestinationStatesImpl(flow, state.Actions, result);
        return result;
    }

    public Check(flow: IFlowInfo, errorMessages: string[]): number {
        let errorCount = 0;
        flow.States.forEach((state): void => {
            const messages = [] as string[];
            errorCount += stateOp.Check(state, messages);
            messages.forEach((msg) => {
                errorMessages.push(`[${flow.Name}]${msg}`);
            });
        });

        return errorCount;
    }

    public Fix(flow: IFlowInfo): TFixResult {
        let result: TFixResult = 'nothing';
        flow.States.forEach((state): void => {
            if (stateOp.Fix(state) === 'fixed') {
                result = 'fixed';
            }
        });

        // 确保每一个切换状态指令的stateId合法
        const allStateIds = flow.States.map((state) => state.Id);
        flow.States.forEach((state) => {
            stateOp.ForeachActions(state, (action) => {
                if (action.Name === 'ChangeState') {
                    const changeState = action.Params as IChangeState;
                    if (!allStateIds.includes(changeState.StateId)) {
                        warn(`ChangeState: 移除不存在的状态id ${changeState.StateId}`);
                        changeState.StateId = allStateIds[0];
                        result = 'fixed';
                    }
                } else if (action.Name === 'ChangeRandomState') {
                    const changeRandomState = action.Params as IChangeRandomState;
                    const stateIds = changeRandomState.StateIds;
                    for (let i = stateIds.length - 1; i >= 0; i--) {
                        const stateId = stateIds[i];
                        if (!allStateIds.includes(stateId)) {
                            warn(`ChangeRandomState: 移除不存在的状态id ${stateId}`);
                            stateIds.splice(i, 1);
                            result = 'fixed';
                        }
                    }

                    if (stateIds.length < 0) {
                        warn(`ChangeRandomState 确保至少存在一个状态id`);
                        stateIds.push(allStateIds[0]);
                        result = 'fixed';
                    }
                }
            });
        });

        return result;
    }
}

export const editorFlowOp = new EditorFlowOp();
