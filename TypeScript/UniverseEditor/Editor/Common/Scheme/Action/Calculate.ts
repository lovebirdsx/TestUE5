import {
    calOpTypeConfig,
    compareTypeConfig,
    IActionInfo,
    ICallByCondition,
    ICallFunction,
    ICondition,
    IConditions,
    IDoCalculate,
    ISetNumberVar,
    ISyncVarToActorState,
    logicOpTypeConfig,
    TCalOp,
    TCompare,
    TLogicOpType,
    TVar,
} from '../../../../Common/Interface/IAction';
import {
    DEFUALT_NUMBER_EDIT_TEXT_WIDTH,
    DEFUALT_VALUE_NAME_TEXT_WIDTH,
} from '../../BaseComponent/CommonComponent';
import {
    createArrayScheme,
    createEnumScheme,
    createObjectScheme,
    createScheme,
    createStringScheme,
} from '../../Type';
import { functionActionScheme } from './Action';

export const varValueScheme = createScheme<TVar>({
    Name: 'Value',
    CnName: '变量/值',
    Tip: '可以填入变量字符串或者变量的值, 会自动进行识别',
    CreateDefault: () => 0,
    Width: DEFUALT_NUMBER_EDIT_TEXT_WIDTH,
    ShowName: false,
});

export const varNameScheme = createStringScheme({
    CnName: '变量名',
    Tip: '变量的名字',
    CreateDefault: () => '变量1',
    ShowName: false,
    Width: DEFUALT_VALUE_NAME_TEXT_WIDTH,
    Name: 'Name',
    IsUnique: true,
});

export const setNumberVarScheme = createObjectScheme<ISetNumberVar>({
    CnName: '设定Number值',
    Tip: '设定Number类型变量的值',
    Fields: {
        Name: varNameScheme,
        Value: varValueScheme,
    },
});

export const syncVarToActorStateScheme = createObjectScheme<ISyncVarToActorState>({
    CnName: '同步Actor状态',
    Tip: '将对应变量的值同步给Actor状态',
    Fields: {
        VarName: varNameScheme,
        StateKey: createStringScheme({
            CnName: '状态Key',
            Tip: '同步给Actor的状态的Key',
            Width: DEFUALT_VALUE_NAME_TEXT_WIDTH,
        }),
    },
});

export const calOpScheme = createEnumScheme<TCalOp>({
    Config: calOpTypeConfig,
});

export const doCalculateScheme = createObjectScheme<IDoCalculate>({
    Tip: '逻辑运算',
    Fields: {
        Var1: varValueScheme,
        Op: calOpScheme,
        Var2: varValueScheme,
        Result: varNameScheme,
    },
});

export const compareScheme = createEnumScheme<TCompare>({
    Config: compareTypeConfig,
});

export const conditionScheme = createObjectScheme<ICondition>({
    Name: 'Condition',
    CnName: '条件',
    Tip: '逻辑计算的条件',
    Fields: {
        Var1: varValueScheme,
        Compare: compareScheme,
        Var2: varValueScheme,
    },
});

export const logicOpTypeScheme = createEnumScheme<TLogicOpType>({
    Tip: '逻辑计算类型',
    Config: logicOpTypeConfig,
    CnName: '逻辑计算类型',
    ShowName: true,
});

export const conditionsScheme = createObjectScheme<IConditions>({
    Tip: '条件类型',
    Fields: {
        LogicOpType: logicOpTypeScheme,
        Conditions: createArrayScheme({
            CnName: '条件',
            Tip: '逻辑计算的条件',
            Element: conditionScheme,
            NewLine: true,
            ArraySimplify: true,
        }),
    },
    NewLine: true,
});

export const callByConditionScheme = createObjectScheme<ICallByCondition>({
    Tip: '按照条件来执行动作',
    Fields: {
        Conditions: conditionsScheme,
        TrueActions: createArrayScheme<IActionInfo>({
            CnName: '条件为真的动作',
            Tip: '条件为真时执行的动作列表',
            NewLine: true,
            Element: functionActionScheme,
            Optional: true,
        }),
        FalseActions: createArrayScheme<IActionInfo>({
            CnName: '条件为假的动作',
            Tip: '条件为假时执行的动作列表',
            NewLine: true,
            Element: functionActionScheme,
            Optional: true,
        }),
    },
});

export const functionNameScheme = createStringScheme({
    CnName: '函数名',
    Tip: '函数的名字',
    CreateDefault: () => '函数1',
    ShowName: false,
    IsUnique: true,
});

export const callFunctionScheme = createObjectScheme<ICallFunction>({
    Tip: '调用函数',
    Fields: {
        Name: functionNameScheme,
    },
});
