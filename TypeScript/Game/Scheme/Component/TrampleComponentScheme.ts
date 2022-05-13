/* eslint-disable spellcheck/spell-checker */
import {
    createArrayScheme,
    createBooleanScheme,
    createObjectScheme,
    createTextScheme,
    EActionFilter,
} from '../../../Common/Type';
import { IActionInfo } from '../../Flow/Action';
import { actionRegistry } from '../Action/Public';

export interface ITrampleActions {
    Name: string;
    Actions: IActionInfo[];
}

export interface ITrampleComponent {
    IsDisposable: boolean;
    TriggerActions: ITrampleActions;
    RecoveryActions: ITrampleActions;
}

export const trampletriggerScheme = createObjectScheme<ITrampleActions>({
    Name: 'trampletrigger',
    Fields: {
        Name: createTextScheme({
            CreateDefault(): string {
                return '踩踏事件';
            },
        }),
        Actions: createArrayScheme({
            NewLine: true,
            Element: actionRegistry.GetActionScheme(EActionFilter.Trample),
        }),
    },
    NewLine: true,
    NoIndent: true,
});

export const trampleleaveScheme = createObjectScheme<ITrampleActions>({
    Name: 'trampleleaveScheme',
    Fields: {
        Name: createTextScheme({
            CreateDefault(): string {
                return '离开事件';
            },
        }),
        Actions: createArrayScheme({
            NewLine: true,
            Element: actionRegistry.GetActionScheme(EActionFilter.Trample),
        }),
    },
    NewLine: true,
    NoIndent: true,
});

export const trampleComponentScheme = createObjectScheme<ITrampleComponent>({
    Name: 'TrampleComponent',
    Fields: {
        IsDisposable: createBooleanScheme({
            CnName: `是否一次性`,
            ShowName: true,
            NewLine: true,
            Tip: '是否自动运行',
        }),
        TriggerActions: trampletriggerScheme,
        RecoveryActions: trampleleaveScheme,
    },
    NewLine: true,
});
