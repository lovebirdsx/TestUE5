/* eslint-disable spellcheck/spell-checker */
import {
    createIntScheme,
    createObjectScheme,
    createVectorScheme,
    IVectorType,
} from '../../../Common/Type';

export interface IGrabComponent {
    GrabPos: IVectorType;
    ThrowPow: number;
    ThrowHight: number;
}

export const grabComponentScheme = createObjectScheme<IGrabComponent>({
    Name: 'GrabComponent',
    Fields: {
        GrabPos: createVectorScheme({
            CnName: '抓取位置',
            ShowName: true,
            NewLine: true,
            Tip: '抓取位置',
        }),
        ThrowPow: createIntScheme({
            CnName: '扔出力度',
            ShowName: true,
            NewLine: true,
            Tip: '抛出时的力度',
        }),
        ThrowHight: createIntScheme({
            CnName: '扔出时额外高度',
            ShowName: true,
            NewLine: true,
            Tip: '扔出时额外高度',
        }),
    },
    NewLine: true,
});
