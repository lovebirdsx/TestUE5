import { createArrayScheme } from '../../../../Common/Type';
import { ISwitcherComponent } from '../../../../Game/Interface/Component';
import { triggerActionScheme } from '../Action/Action';
import { createComponentScheme } from './ComponentRegistry';
import { interactiveComponentFields } from './InteractComponentScheme';

export const switcherComponentScheme = createComponentScheme<ISwitcherComponent>({
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
