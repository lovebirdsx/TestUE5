import { createArrayScheme, createObjectSchemeForComponent } from '../../../Common/Type';
import { ISwitcherComponent } from '../../Interface';
import { triggerActionScheme } from '../Action/Action';
import { interactiveComponentFields } from './InteractComponentScheme';

export const switcherComponentScheme = createObjectSchemeForComponent<ISwitcherComponent>({
    Fields: {
        ...interactiveComponentFields,
        OnActions: createArrayScheme({
            CnName: '开启动作',
            NewLine: true,
            Element: triggerActionScheme,
        }),
        OffActions: createArrayScheme({
            CnName: '关闭动作',
            NewLine: true,
            Element: triggerActionScheme,
        }),
    },
});
