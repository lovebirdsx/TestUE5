/* eslint-disable spellcheck/spell-checker */
import { createObjectScheme, intScheme } from '../../../Common/Type';
import { flowOp } from '../../Common/Operations/Flow';
import { IFlowInfo } from '../../Flow/Action';
import { IBehaviorFlowComponent, IFlowComponent } from '../../Interface';
import { playFlowScheme } from '../Action/Flow';

export const flowComponentScheme = createObjectScheme<IFlowComponent>({
    Name: 'FlowComponent',
    Fields: {
        InitState: playFlowScheme,
    },
    NewLine: true,
});

export const behaviorFlowComponentScheme = createObjectScheme<IBehaviorFlowComponent>({
    Name: 'BehaviorFlowComponent',
    CreateDefault: () => undefined,
    NewLine: true,
    Fields: {
        InitStateId: intScheme,
        FlowInfo: createObjectScheme<IFlowInfo>({
            Fix: (flowInfo: IFlowInfo) => {
                return flowOp.Fix(flowInfo);
            },
            Check: (flowInfo: IFlowInfo, messages: string[]) => {
                return flowOp.Check(flowInfo, messages);
            },
        }),
    },
});
