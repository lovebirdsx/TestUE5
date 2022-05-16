import {
    createArrayScheme,
    createBooleanScheme,
    createIntScheme,
    createObjectScheme,
    EActionFilter,
} from '../../../Common/Type';
import { ITriggerActions } from '../../Flow/Action';
import { ITriggerComponent } from '../../Interface';
import { actionRegistry } from '../Action/Public';

export const triggerActionsScheme = createObjectScheme<ITriggerActions>({
    Name: 'TriggerActions',
    Fields: {
        Actions: createArrayScheme({
            NewLine: true,
            Element: actionRegistry.GetActionScheme(EActionFilter.Trigger),
            Tip: '触发之后执行的动作序列',
        }),
    },
    NewLine: true,
    NoIndent: true,
});

export const triggerComponentScheme = createObjectScheme<ITriggerComponent>({
    Name: 'TriggerComponent',
    Fields: {
        MaxTriggerTimes: createIntScheme({
            CnName: '触发次数',
            ShowName: true,
            Tip: '最大触发次数',
            NewLine: true,
        }),
        IsNotLoad: createBooleanScheme({
            CnName: '是否不加载状态',
            RenderType: 'boolean',
            ShowName: true,
            NewLine: true,
            CreateDefault: () => false,
        }),
        TriggerActions: triggerActionsScheme,
    },
    ShowName: true,
    NoIndent: true,
});
