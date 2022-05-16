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
                return flowInfo ? flowOp.Fix(flowInfo) : 'canNotFixed';
            },
            Check: (flowInfo: IFlowInfo, messages: string[]) => {
                return flowInfo ? flowOp.Check(flowInfo, messages) : 0;
            },
        }),
    },
    Check: (value: IBehaviorFlowComponent, messages: string[]) => {
        if (!value.FlowInfo) {
            return 0;
        }

        if (!value.InitStateId) {
            messages.push(`BehaviorFlowComponent的初始状态没有配置`);
            return 1;
        }

        if (!flowOp.GetState(value.FlowInfo, value.InitStateId)) {
            messages.push(`BehaviorFlowComponent的中不存在id为${value.InitStateId}的状态`);
            return 1;
        }
        return 0;
    },
});
