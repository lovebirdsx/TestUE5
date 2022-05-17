import { createArrayScheme, createBooleanScheme, createObjectScheme } from '../../../Common/Type';
import { ISwitcherComponent } from '../../Interface';
import { triggerActionScheme } from '../Action/Action';

export const switcherComponentScheme = createObjectScheme<ISwitcherComponent>({
    Fields: {
        IsInitOn: createBooleanScheme({
            CnName: '初始是否开启',
            ShowName: true,
            NewLine: true,
        }),
        AutoExecuteOnLoad: createBooleanScheme({
            CnName: '加载时自动运行',
            ShowName: true,
            NewLine: true,
        }),
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
