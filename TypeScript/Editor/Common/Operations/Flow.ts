/* eslint-disable spellcheck/spell-checker */
import {
    IActionInfo,
    IChangeRandomState,
    IChangeState,
    IFlowInfo,
    IShowTalk,
    IStateInfo,
} from '../../../Game/Flow/Action';

class EditorFlowOp {
    public CreateState(flow: IFlowInfo): IStateInfo {
        const state: IStateInfo = {
            Name: `状态${flow.StateGenId}`,
            Actions: [],
            Id: flow.StateGenId,
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
}

export const editorFlowOp = new EditorFlowOp();
