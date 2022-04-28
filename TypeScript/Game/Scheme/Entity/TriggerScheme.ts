import {
    createArrayScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
    EActionFilter,
} from '../../../Common/Type';
import { ITriggerActions } from '../../Flow/Action';
import { ITsTrigger } from '../../Interface';
import { actionRegistry } from '../Action/Public';

export const actionsScheme = createObjectScheme<ITriggerActions>({
    Name: 'TriggerActions',
    Fields: {
        Actions: createArrayScheme({
            NewLine: true,
            Element: actionRegistry.GetActionScheme(EActionFilter.Trigger),
        }),
    },
});

export const actionsJsonScheme = createStringScheme({
    Name: 'ActionsJson',
    IsJson: true,
    NewLine: true,
});

export const triggerScheme = createObjectScheme<ITsTrigger>({
    Name: 'TsTrigger',
    Fields: {
        MaxTriggerTimes: createIntScheme({
            ShowName: true,
            NewLine: true,
        }),
        TriggerActionsJson: actionsJsonScheme,
    },
});
