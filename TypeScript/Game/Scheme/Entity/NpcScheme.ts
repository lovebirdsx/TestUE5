import { createStringScheme, emptyObjectScheme } from '../../../Common/Type';
import { parsePlayFlow } from '../../Flow/Action';

export const playFlowJsonScheme = createStringScheme({
    Name: 'PlayFlowJson',
    NewLine: true,
    CreateDefault: (): string => {
        return JSON.stringify(parsePlayFlow(''));
    },
});

export const npcScheme = emptyObjectScheme;
