import { createObjectScheme } from '../../../Common/Type';
import { IFlowComponent } from '../../Interface';
import { playFlowScheme } from '../Action/Public';

export const flowComponentScheme = createObjectScheme<IFlowComponent>({
    Name: 'FlowComponent',
    Fields: {
        InitState: playFlowScheme,
    },
});
