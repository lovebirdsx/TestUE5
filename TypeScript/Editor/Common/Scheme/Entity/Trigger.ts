import TsTrigger from '../../../../Game/Entity/TsTrigger';
import { createIntScheme, createObjectSchemeForUeClass, createStringScheme } from '../Action';

export const triggerScheme = createObjectSchemeForUeClass<TsTrigger>({
    MaxTriggerTimes: createIntScheme({
        Meta: {
            NewLine: true,
        },
    }),
    TriggerActions: createStringScheme({
        Meta: {
            NewLine: true,
        },
    }),
});
