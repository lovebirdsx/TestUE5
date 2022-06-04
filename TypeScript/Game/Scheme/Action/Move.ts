/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { IPosA, IVectorInfo } from '../../../Common/Interface';
import {
    createFloatScheme,
    createObjectScheme,
    createStringScheme,
    optionalFloatScheme,
} from '../../../Common/Type';
import { IFaceToPos, IMoveToPosA, ISetMoveSpeed, ISetPosA, ISimpleMove } from '../../Interface/Action';

export const posScheme = createObjectScheme<IPosA>({
    Name: 'PosA',
    CnName: '位置',
    Fields: {
        X: optionalFloatScheme,
        Y: optionalFloatScheme,
        Z: optionalFloatScheme,
        A: optionalFloatScheme,
    },
    CreateDefault: () => {
        return { X: 0, Y: 0, Z: 0, A: 0 };
    },
    Check: () => {
        return 0;
    },
    ShowName: true,
    NewLine: true,
    Tip: '目标位置',
});

export const setPosScheme = createObjectScheme<ISetPosA>({
    CnName: '设定位置',
    Fields: {
        Pos: posScheme,
    },
    Tip: '将实体设定到目标位置',
});

export const setMoveSpeedScheme = createObjectScheme<ISetMoveSpeed>({
    CnName: '设定移动速度',
    Fields: {
        Speed: createFloatScheme({
            CnName: '速度',
            Tip: '角色移动的速度(厘米/秒)',
        }),
    },
});

export const moveToPosScheme = createObjectScheme<IMoveToPosA>({
    CnName: '移动到目标点',
    Fields: {
        Timeout: createFloatScheme({
            CnName: '超时间隔',
            CreateDefault: () => 20,
            ShowName: true,
            Tip: '超时的间隔',
            NewLine: true,
        }),
        Pos: posScheme,
    },
    Tip: '移动到目标点,超时则会取消移动',
    Scheduled: true,
});

export const faceToPosScheme = createObjectScheme<IFaceToPos>({
    CnName: '朝向目标点',
    Scheduled: true,
    Fields: {
        Pos: posScheme,
    },
    Tip: '朝向目标点',
});

export const simpleMoveScheme = createObjectScheme<ISimpleMove>({
    CnName: '简单移动',
    Fields: {
        Who: createStringScheme({
            CnName: '目标',
            RenderType: 'entityId',
            CreateDefault: () => '',
            ShowName: true,
            NewLine: true,
        }),
        UseTime: createFloatScheme({
            CnName: '移动时间',
            CreateDefault: () => 1,
            ShowName: true,
            NewLine: true,
        }),
        Pos: posScheme,
    },
    Tip: '移动到目标点',
});

export const dirScheme = createObjectScheme<IVectorInfo>({
    CnName: '方向',
    Fields: {
        X: optionalFloatScheme,
        Y: optionalFloatScheme,
        Z: optionalFloatScheme,
    },
    CreateDefault: () => {
        return { X: 0, Y: 0, Z: 0 };
    },
    Check: () => {
        return 0;
    },
    ShowName: true,
    NewLine: true,
    Tip: '显示方向',
});
