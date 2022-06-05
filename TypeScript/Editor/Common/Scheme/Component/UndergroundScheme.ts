/* eslint-disable spellcheck/spell-checker */
import {
    createArrayScheme,
    createBooleanScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
    createVectorScheme,
} from '../../../../Common/Type';
import { IStateInfo, IUndergroundComponent } from '../../../../Game/Interface/Component';
import { createComponentScheme } from './ComponentRegistry';

export const stateInfoScheme = createObjectScheme<IStateInfo>({
    Name: 'StateInfoScheme',
    Fields: {
        StateId: createIntScheme({
            CnName: '状态id',
            RenderType: 'int',
            ShowName: true,
            NewLine: true,
        }),
        RestartPos: createVectorScheme({
            CnName: '主角返回位置',
            ShowName: true,
            NewLine: true,
        }),
    },
    NewLine: true,
    NoIndent: true,
});

export const undergroundActionsScheme = createComponentScheme<IUndergroundComponent>({
    Name: 'UndergroundActions',
    Fields: {
        TestState: createIntScheme({
            CnName: '测试状态',
            RenderType: 'int',
            ShowName: true,
            NewLine: true,
            Tip: `0时读取记录，-1时从playerstart开始`,
            CreateDefault: () => 0,
        }),
        DestroyTag: createArrayScheme({
            CnName: '销毁物体的tag表',
            ShowName: true,
            NewLine: true,
            Element: createStringScheme({
                CnName: '要销毁的物体的tag',
                RenderType: 'string',
                ShowName: true,
                NewLine: true,
                CreateDefault: () => ``,
            }),
        }),
        IsRestartPlayer: createBooleanScheme({
            CnName: '是否调整主角位置',
            RenderType: 'boolean',
            ShowName: true,
            NewLine: true,
            CreateDefault: () => false,
        }),
        StateInfo: createArrayScheme({
            CnName: '状态表',
            ShowName: true,
            NewLine: true,
            Element: stateInfoScheme,
        }),
    },
    NewLine: true,
    NoIndent: true,
});
