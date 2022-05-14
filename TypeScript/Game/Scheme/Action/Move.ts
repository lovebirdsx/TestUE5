/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { IVectorInfo } from '../../../Common/Interface';
import {
    allActionFilters,
    createFloatScheme,
    createObjectScheme,
    createStringScheme,
} from '../../../Common/Type';
import { IFaceToPos, IMoveToPos, ISimpleMove } from '../../Flow/Action';

export const posScheme = createObjectScheme<IVectorInfo>({
    CnName: '位置',
    Fields: {
        X: undefined,
        Y: undefined,
        Z: undefined,
    },
    CreateDefault: () => {
        return { X: 0, Y: 0, Z: 0 };
    },
    Check: () => {
        return 0;
    },
    ShowName: true,
    NewLine: true,
    Tip: '目标位置',
});

export const moveToPosScheme = createObjectScheme<IMoveToPos>({
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
    Filters: allActionFilters,
});

export const faceToPosScheme = createObjectScheme<IFaceToPos>({
    CnName: '朝向目标点',
    Fields: {
        Pos: posScheme,
    },
    Tip: '朝向目标点',
    Filters: allActionFilters,
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
    Filters: allActionFilters,
});
