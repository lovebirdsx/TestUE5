/* eslint-disable spellcheck/spell-checker */
import {
    createIntScheme,
    createObjectScheme,
    createVectorScheme,
    IVectorType,
} from '../../../Common/Type';

export interface ISpringComponent {
    SpringDir: IVectorType;
    SpringPow: number;
}

export const springComponentScheme = createObjectScheme<ISpringComponent>({
    Name: 'RotatorComponent',
    Fields: {
        SpringDir: createVectorScheme({
            CnName: '反弹方向',
            ShowName: true,
            NewLine: true,
            Tip: '反弹方向',
        }),
        SpringPow: createIntScheme({
            CnName: '反弹力度',
            ShowName: true,
            NewLine: true,
            Tip: '反弹力度',
        }),
    },
    NewLine: true,
});
