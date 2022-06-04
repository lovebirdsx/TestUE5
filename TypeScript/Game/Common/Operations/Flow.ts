/* eslint-disable spellcheck/spell-checker */
import { warn } from '../../../Common/Log';
import { TFixResult } from '../../../Common/Type';
import { IChangeRandomState, IChangeState, IFlowInfo, IStateInfo } from '../../Interface/Action';
import { stateOp } from './State';

class FlowOp {
    public GetState(flow: IFlowInfo, stateId: number): IStateInfo {
        return flow.States.find((state) => state.Id === stateId);
    }

    public GetStateNames(flow: IFlowInfo): string[] {
        return flow.States.map((state) => state.Name);
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

export const flowOp = new FlowOp();
