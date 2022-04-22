import { createStringScheme, emptyObjectScheme } from '../../../../Common/Type';
import { parsePlayFlow } from '../../../../Game/Flow/Action';

export const playFlowJsonScheme = createStringScheme({
    NewLine: true,
    CreateDefault: (): string => {
        return JSON.stringify(parsePlayFlow(''));
    },
});

export const npcScheme = emptyObjectScheme;
