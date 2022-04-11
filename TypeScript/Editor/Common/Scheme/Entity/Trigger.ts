import TsTrigger from '../../../../Game/Entity/TsTrigger';
import { createObjectSchemeForUeClass, intScheme, stringScheme } from '../Action';

export const triggerScheme = createObjectSchemeForUeClass<TsTrigger>({
    MaxTriggerTimes: intScheme,
    TriggerActions: stringScheme,
});
