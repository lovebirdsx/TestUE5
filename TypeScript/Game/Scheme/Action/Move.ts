/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { allActionFilters, createFloatScheme, createObjectScheme } from '../../../Common/Type';
import { IMoveToPos, IVector } from '../../Flow/Action';

export const posScheme = createObjectScheme<IVector>({
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
    Tip: '目标位置',
});

export const moveToPosScheme = createObjectScheme<IMoveToPos>({
    Fields: {
        Timeout: createFloatScheme({
            CreateDefault: () => 5,
            ShowName: true,
            Tip: '超时的间隔',
        }),
        Pos: posScheme,
    },
    Tip: '移动到目标点,超时则会取消移动',
    Scheduled: true,
    Filters: allActionFilters,
});
