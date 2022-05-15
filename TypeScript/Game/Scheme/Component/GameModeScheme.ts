import {
    createArrayScheme,
    createIntScheme,
    createObjectScheme,
    createVectorScheme,
    IVectorType,
} from '../../../Common/Type';

export interface IStateInfo {
    StateId: number;
    RestartPos: IVectorType;
}

export interface IGameModeComponent {
    TestState: number;
    StateInfo: IStateInfo[];
}

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

export const gameModeActionsScheme = createObjectScheme<IGameModeComponent>({
    Name: 'GameModeActions',
    Fields: {
        TestState: createIntScheme({
            CnName: '测试状态，非0时使用',
            RenderType: 'int',
            ShowName: true,
            NewLine: true,
            CreateDefault: () => 0,
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
