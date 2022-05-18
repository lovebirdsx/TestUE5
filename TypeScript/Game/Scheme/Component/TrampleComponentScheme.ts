/* eslint-disable spellcheck/spell-checker */
import {
    createArrayScheme,
    createBooleanScheme,
    createObjectSchemeForComponent,
    EActionFilter,
} from '../../../Common/Type';
import { IActionInfo } from '../../Flow/Action';
import { actionRegistry } from '../Action/Public';

export interface ITrampleComponent {
    IsDisposable: boolean;
    TriggerActions: IActionInfo[];
    RecoveryActions: IActionInfo[];
}

export const trampleComponentScheme = createObjectSchemeForComponent<ITrampleComponent>({
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
            ShowName: true,
            NewLine: true,
            Element: actionRegistry.GetActionScheme(EActionFilter.Trample),
        }),
        RecoveryActions: createArrayScheme({
            CnName: `离开事件`,
            ShowName: true,
            NewLine: true,
            Element: actionRegistry.GetActionScheme(EActionFilter.Trample),
        }),
    },
    NewLine: true,
});
