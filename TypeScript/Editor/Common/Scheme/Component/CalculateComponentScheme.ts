import { createArrayScheme, createFloatScheme, createObjectScheme } from '../../../../Common/Type';
import { IActionInfo, IFunction, INumberVar } from '../../../../Game/Interface/Action';
import { ICalculateComponent } from '../../../../Game/Interface/Component';
import { functionActionScheme } from '../Action/Action';
import { functionNameScheme, varNameScheme } from '../Action/Calculate';
import { createComponentScheme } from './ComponentRegistry';

export const numberVarScheme = createObjectScheme<INumberVar>({
    Fields: {
        Name: varNameScheme,
        Value: createFloatScheme({
            Tip: '变量值, 类型为数字',
        }),
    },
});

export const functionScheme = createObjectScheme<IFunction>({
    Fields: {
        Name: functionNameScheme,
        Actions: createArrayScheme<IActionInfo>({
            Element: functionActionScheme,
            NewLine: true,
            ArraySimplify: true,
            CnName: '动作',
            Tip: '函数中需要执行的动作',
        }),
    },
});

export const calculateComponentScheme = createComponentScheme<ICalculateComponent>({
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