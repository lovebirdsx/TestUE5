import {
    createArrayScheme,
    createFloatScheme,
    createObjectScheme,
    createStringScheme,
} from '../../../Common/Type';
import { IFunction, INumberVar } from '../../Flow/Action';
import { ICalculatorComponent } from '../../Interface';
import { functionActionsScheme } from '../Action/Action';

export const numberVarScheme = createObjectScheme<INumberVar>({
    Fields: {
        Name: createStringScheme({
            CnName: '名字',
            CreateDefault: () => '变量1',
            ShowName: true,
            Name: 'Name',
            IsUnique: true,
        }),
        Value: createFloatScheme({
            CnName: '值',
            ShowName: true,
            Name: 'Value',
        }),
    },
});

export const functionScheme = createObjectScheme<IFunction>({
    Fields: {
        Name: createStringScheme({
            CnName: '函数名',
            CreateDefault: () => '函数1',
            ShowName: true,
            IsUnique: true,
        }),
        Actions: createArrayScheme({
            Element: functionActionsScheme,
            NewLine: true,
            ArraySimplify: true,
            CnName: '动作',
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
