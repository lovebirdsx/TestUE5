/* eslint-disable spellcheck/spell-checker */
import { IFlowInfo, IStateInfo } from '../../Interface/Action';

class FlowOp {
    public GetState(flow: IFlowInfo, stateId: number): IStateInfo {
        return flow.States.find((state) => state.Id === stateId);
    }

    public GetStateNames(flow: IFlowInfo): string[] {
        return flow.States.map((state) => state.Name);
    }
}

export const flowOp = new FlowOp();
