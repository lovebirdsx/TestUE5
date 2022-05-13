/* eslint-disable spellcheck/spell-checker */
import { createObjectScheme } from '../../../Common/Type';
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
    Fields: {
        InitStateId: undefined,
        FlowInfo: undefined,
    },
    CreateDefault: () => undefined,
    NewLine: true,
});
