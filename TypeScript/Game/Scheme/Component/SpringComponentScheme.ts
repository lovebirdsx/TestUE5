/* eslint-disable spellcheck/spell-checker */
import {
    createBooleanScheme,
    createIntScheme,
    createObjectScheme,
    createObjectSchemeForComponent,
    createVectorScheme,
    IVectorType,
} from '../../../Common/Type';

export interface ISettingSpringDir {
    IsSettingDir: boolean;
    IsRotator: boolean;
    SpringDir: IVectorType;
}
export interface ISpringComponent {
    IsNormalSpring: boolean;
    IsHitNormalSpring: boolean;
    SettingDir: ISettingSpringDir;
    SpringPow: number;
}

export const springSettingDirScheme = createObjectScheme<ISettingSpringDir>({
    Name: 'RotatorComponent',
    Fields: {
        IsSettingDir: createBooleanScheme({
            CnName: '固定方向反弹',
            ShowName: true,
            Tip: '反弹模式3',
        }),
        SpringDir: createVectorScheme({
            CnName: '方向',
            ShowName: true,
            NewLine: true,
        }),
        IsRotator: createBooleanScheme({
            CnName: '方向是否跟随物体旋转',
            ShowName: true,
            NewLine: true,
            CreateDefault: () => true,
        }),
    },
    NewLine: true,
});

export const springComponentScheme = createObjectSchemeForComponent<ISpringComponent>({
    Name: 'RotatorComponent',
    Fields: {
        IsNormalSpring: createBooleanScheme({
            CnName: '正常反弹',
            ShowName: true,
            NewLine: true,
            Tip: '反弹模式1',
        }),
        IsHitNormalSpring: createBooleanScheme({
            CnName: '原方向反弹',
            ShowName: true,
            NewLine: true,
            Tip: '反弹模式2',
        }),
        SettingDir: springSettingDirScheme,
        SpringPow: createIntScheme({
            CnName: '反弹力度',
            ShowName: true,
            NewLine: true,
            Tip: '反弹力度',
        }),
    },
    NewLine: true,
});
