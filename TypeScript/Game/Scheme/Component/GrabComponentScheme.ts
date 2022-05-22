/* eslint-disable spellcheck/spell-checker */
import { createIntScheme, createVectorScheme, IVectorType } from '../../../Common/Type';
import { createComponentScheme } from './ComponentRegistry';

export interface IGrabComponent {
    GrabPos: IVectorType;
    ThrowPow: number;
    ThrowHight: number;
}

export const grabComponentScheme = createComponentScheme<IGrabComponent>({
    Actions: [],
    Name: 'GrabComponent',
    Fields: {
        GrabPos: createVectorScheme({
            CnName: '抓取位置',
            ShowName: true,
            NewLine: true,
            Tip: '抓取位置',
            CreateDefault(): IVectorType {
                return {
                    X: 100,
                    Y: 0,
                    Z: 50,
                };
            },
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
