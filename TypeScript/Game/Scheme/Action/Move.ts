/* eslint-disable spellcheck/spell-checker */
import { createObjectScheme } from '../../../Common/Type';
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
});

export const moveToPosScheme = createObjectScheme<IMoveToPos>({
    Fields: {
        Pos: posScheme,
    },
});
