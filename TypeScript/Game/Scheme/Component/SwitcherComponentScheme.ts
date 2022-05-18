import { createArrayScheme, createObjectScheme } from '../../../Common/Type';
import { ISwitcherComponent } from '../../Interface';
import { triggerActionScheme } from '../Action/Action';

export const switcherComponentScheme = createObjectScheme<ISwitcherComponent>({
    Fields: {
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
