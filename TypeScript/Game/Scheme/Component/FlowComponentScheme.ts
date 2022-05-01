import { createBooleanScheme, createObjectScheme } from '../../../Common/Type';
import { IFlowComponent } from '../../Interface';
import { playFlowScheme } from '../Action/Public';

export const flowComponentScheme = createObjectScheme<IFlowComponent>({
    Name: 'FlowComponent',
    Fields: {
        InitState: playFlowScheme,
        AutoRun: createBooleanScheme({
            ShowName: true,
            NewLine: true,
            Tip: '是否自动运行',
        }),
    },
    NewLine: true,
});
