import {
    createArrayScheme,
    createFloatScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
} from '../../../Common/Type';
import { IFunction, INumberVar } from '../../Flow/Action';
import { ICalculatorComponent } from '../../Interface';
import { functionActionsScheme } from '../Action/Action';

export const numberVarScheme = createObjectScheme<INumberVar>({
    Fields: {
        Name: createStringScheme({
            CnName: '变量名字',
            Name: 'Name',
        }),
        Value: createFloatScheme({
            CnName: '变量值',
            Name: 'Value',
        }),
    },
});

export const functionScheme = createObjectScheme<IFunction>({
    Fields: {
        Id: createIntScheme({
            CnName: 'Id',
        }),
        Name: createStringScheme({
            CnName: '函数名字',
        }),
        Actions: createArrayScheme({
            Element: functionActionsScheme,
            NewLine: true,
        }),
    },
});

export const calculateComponentScheme = createObjectScheme<ICalculatorComponent>({
    Fields: {
        Vars: createArrayScheme({
            Element: numberVarScheme,
            CnName: '变量',
            NewLine: true,
        }),
        Functions: createArrayScheme({
            Element: functionScheme,
            CnName: '函数',
            NewLine: true,
        }),
    },
    NewLine: true,
});
