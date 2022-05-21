/* eslint-disable spellcheck/spell-checker */
import {
    createObjectScheme,
    createObjectSchemeForComponent,
    intScheme,
} from '../../../Common/Type';
import { flowOp } from '../../Common/Operations/Flow';
import { IFlowInfo } from '../../Flow/Action';
import { IBehaviorFlowComponent, IFlowComponent } from '../../Interface';
import { playFlowScheme } from '../Action/Flow';

export const flowComponentScheme = createObjectScheme<IFlowComponent>({
    Name: 'FlowComponent',
    Fields: {
        InitState: playFlowScheme,
    },
    Check: (value: IFlowComponent, messages: string[]) => {
        if (!value) {
            messages.push(`FlowComponent的初始状态没有配置`);
            return 1;
        }

        const messages0: string[] = [];
        if (playFlowScheme.Check(value.InitState, messages0) > 0) {
            messages0.forEach((msg) => {
                messages.push(`[FlowComponent]${msg}`);
            });
            return messages0.length;
        }
        return 0;
    },
    NewLine: true,
});

export const behaviorFlowComponentScheme = createObjectSchemeForComponent<IBehaviorFlowComponent>({
    Name: 'BehaviorFlowComponent',
    CreateDefault: () => {
        return {
            InitStateId: 0,
            FlowInfo: {
                Id: 0,
                Name: 'Empty',
                StateGenId: 1,
                States: [
                    {
                        Id: 0,
                        Name: '状态1',
                        Actions: [],
                    },
                ],
            },
        };
    },
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
    Check: (value: IBehaviorFlowComponent, messages: string[]) => {
        if (!value.FlowInfo) {
            return 0;
        }

        if (value.InitStateId === undefined) {
            messages.push(`BehaviorFlowComponent的初始状态没有配置`);
            return 1;
        }

        if (!flowOp.GetState(value.FlowInfo, value.InitStateId)) {
            messages.push(`BehaviorFlowComponent的中不存在id为${value.InitStateId}的状态`);
            return 1;
        }

        return flowOp.Check(value.FlowInfo, messages);
    },
});
