import { ITriggerActions } from '../../../../Common/Interface/IAction';
import { ITriggerComponent } from '../../../../Common/Interface/IComponent';
import {
    createArrayScheme,
    createBooleanScheme,
    createIntScheme,
    createObjectScheme,
} from '../../Type';
import { triggerActionScheme } from '../Action/Action';
import { createComponentScheme } from './ComponentRegistry';

export const triggerActionsScheme = createObjectScheme<ITriggerActions>({
    Name: 'TriggerActions',
    Fields: {
        Actions: createArrayScheme({
            NewLine: true,
            Element: triggerActionScheme,
            Tip: '触发之后执行的动作序列',
        }),
    },
    NewLine: true,
    NoIndent: true,
});

export const triggerComponentScheme = createComponentScheme<ITriggerComponent>({
    Name: 'TriggerComponent',
    Fields: {
        MaxTriggerTimes: createIntScheme({
            CnName: '触发次数',
            ShowName: true,
            Tip: '最大触发次数',
            NewLine: true,
        }),
        IsNotLoad: createBooleanScheme({
            CnName: '不加载状态',
            RenderType: 'boolean',
            ShowName: true,
            NewLine: true,
            CreateDefault: () => false,
        }),
        TriggerActions: triggerActionsScheme,
    },
    ShowName: true,
    NoIndent: true,
});
