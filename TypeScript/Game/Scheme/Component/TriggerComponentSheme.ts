import {
    createArrayScheme,
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
});

export const triggerComponentScheme = createObjectScheme<ITriggerComponent>({
    Name: 'TriggerComponent',
    Fields: {
        MaxTriggerTimes: createIntScheme({
            ShowName: true,
            Tip: '最大触发次数',
            NewLine: true,
        }),
        TriggerActions: triggerActionsScheme,
    },
    ShowName: true,
});
