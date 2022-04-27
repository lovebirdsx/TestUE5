import { createObjectScheme } from '../../../Common/Type';
import { IFlowComponent } from '../../Entity/Interface';
import { playFlowScheme } from '../Action/Public';

export const flowComponentScheme = createObjectScheme<IFlowComponent>({
    Name: 'FlowComponent',
    Fields: {
        InitState: playFlowScheme,
    },
});
