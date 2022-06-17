/* eslint-disable spellcheck/spell-checker */
import { IFlowInfo } from '../../../../Common/Interface/IAction';
import { IBehaviorFlowComponent, IFlowComponent } from '../../../../Common/Interface/IComponent';
import { flowOp } from '../../../../Common/Operation/Flow';
import { editorFlowOp } from '../../Operations/Flow';
import { createObjectScheme, intScheme } from '../../Type';
import { playFlowScheme } from '../Action/Flow';
import { createComponentScheme } from './ComponentRegistry';

export const flowComponentScheme = createComponentScheme<IFlowComponent>({
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

export const behaviorFlowComponentScheme = createComponentScheme<IBehaviorFlowComponent>({
    Name: 'BehaviorFlowComponent',
    CreateDefault: () => {
        const flowInfo: IBehaviorFlowComponent = {
            InitStateId: 0,
            FlowInfo: {
                Id: 0,
                Name: 'Empty',
                States: [
                    {
                        Id: 0,
                        Name: '状态1',
                        Actions: [],
                    },
                ],
            },
        };
        return flowInfo;
    },
    NewLine: true,
    Fields: {
        InitStateId: intScheme,
        FlowInfo: createObjectScheme<IFlowInfo>({
            Fix: (flowInfo: IFlowInfo) => {
                return editorFlowOp.Fix(flowInfo);
            },
            Check: (flowInfo: IFlowInfo, messages: string[]) => {
                return editorFlowOp.Check(flowInfo, messages);
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

        return editorFlowOp.Check(value.FlowInfo, messages);
    },
});
