/* eslint-disable spellcheck/spell-checker */
import { ITrampleComponent } from '../../../../Game/Interface/IComponent';
import { createArrayScheme, createBooleanScheme } from '../../Type';
import { trampleActionScheme } from '../Action/Action';
import { createComponentScheme } from './ComponentRegistry';

export const trampleComponentScheme = createComponentScheme<ITrampleComponent>({
    Name: 'TrampleComponent',
    Fields: {
        IsDisposable: createBooleanScheme({
            CnName: `是否一次性`,
            ShowName: true,
            NewLine: true,
            Tip: '是否自动运行',
        }),
        TriggerActions: createArrayScheme({
            CnName: `踩踏事件`,
            NewLine: true,
            Element: trampleActionScheme,
        }),
        RecoveryActions: createArrayScheme({
            CnName: `离开事件`,
            NewLine: true,
            Element: trampleActionScheme,
        }),
    },
    NewLine: true,
});
