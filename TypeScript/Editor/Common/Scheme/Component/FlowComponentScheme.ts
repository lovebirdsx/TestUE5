import { createObjectScheme } from '../../../../Common/Type';
import { IFlowComponent } from '../../../../Game/Entity/Interface';
import { playFlowScheme } from '../Action/Index';

export const flowComponentScheme = createObjectScheme<IFlowComponent>({
    InitState: playFlowScheme,
});
