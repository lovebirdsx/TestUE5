/* eslint-disable spellcheck/spell-checker */
import { createBooleanScheme, createObjectScheme } from '../../../Common/Type';
import { IFlowComponent } from '../../Interface';
import { playFlowScheme } from '../Action/Public';

export const flowComponentScheme = createObjectScheme<IFlowComponent>({
    Name: 'FlowComponent',
    Fields: {
        InitState: playFlowScheme,
        AutoRun: createBooleanScheme({
            CnName: '自动启动',
            ShowName: true,
            NewLine: true,
            Tip: '是否自动运行',
        }),
        Continuable: createBooleanScheme({
            CnName: '自动继续',
            ShowName: true,
            NewLine: true,
            Tip: '当前状态结束后,是否继续执行后续的状态',
        }),
    },
    NewLine: true,
});
