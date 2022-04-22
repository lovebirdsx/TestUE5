import {
    createArrayScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
    EActionFilter,
} from '../../../../Common/Type';
import { ITsTrigger } from '../../../../Game/Entity/Interface';
import { ITriggerActions } from '../../../../Game/Flow/Action';
import { actionRegistry } from '../Action/Public';

export const actionsScheme = createObjectScheme<ITriggerActions>({
    Actions: createArrayScheme({
        NewLine: true,
        Element: actionRegistry.GetActionScheme(EActionFilter.Trigger),
    }),
});

export const actionsJsonScheme = createStringScheme({ NewLine: true });

export const triggerScheme = createObjectScheme<ITsTrigger>({
    MaxTriggerTimes: createIntScheme({
        ShowName: true,
        NewLine: true,
    }),
    TriggerActionsJson: actionsJsonScheme,
});
