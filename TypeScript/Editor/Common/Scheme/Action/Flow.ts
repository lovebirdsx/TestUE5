/* eslint-disable spellcheck/spell-checker */
import { createScheme } from '../../../../Common/Type';
import { flowListOp } from '../../../../Game/Common/Operations/FlowList';
import { IPlayFlow } from '../../../../Game/Flow/Action';

export function createDefaultPlayFlowFor(flowListName: string): IPlayFlow {
    const flowList = flowListOp.LoadByName(flowListName);
    const flow = flowList.Flows.length > 0 ? flowList.Flows[0] : null;
    const state = flow && flow.States.length > 0 ? flow.States[0] : null;
    return {
        FlowListName: flowListName,
        FlowId: flow ? flow.Id : 0,
        StateId: state ? state.Id : 0,
    };
}

function createDefaultPlayFlow(): IPlayFlow {
    if (flowListOp.Names.length <= 0) {
        return {
            FlowListName: '',
            FlowId: 0,
            StateId: 0,
        };
    }

    return createDefaultPlayFlowFor(flowListOp.Names[0]);
}

export const playFlowScheme = createScheme<IPlayFlow>({
    Tip: '播放流程配置文件中的某个流程',
    RenderType: 'custom',
    CreateDefault: createDefaultPlayFlow,
});
