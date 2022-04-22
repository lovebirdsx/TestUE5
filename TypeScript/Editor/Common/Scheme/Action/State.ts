/* eslint-disable spellcheck/spell-checker */
import {
    createArrayScheme,
    createIntScheme,
    createObjectScheme,
    EActionFilter,
} from '../../../../Common/Type';
import { IChangeRandomState, IChangeState } from '../../../../Game/Flow/Action';

export const finishStateScheme = createObjectScheme({
    Filters: [EActionFilter.FlowList],
    Tip: '结束状态,后续的动作将不被执行',
});

const DEFAULT_STATE_ID = 1;

export const stateIdScheme = createIntScheme({
    Name: 'StateId',
    CreateDefault: () => DEFAULT_STATE_ID,
});

export const changeStateScheme = createObjectScheme<IChangeState>({
    Name: 'ChangeState',
    Fields: {
        StateId: stateIdScheme,
    },
    Filters: [EActionFilter.FlowList, EActionFilter.Talk],
    Tip: '改变Entity的状态,下一次再和实体交互,则将从此设定的状态开始',
});

export const changeRandomStateScheme = createObjectScheme<IChangeRandomState>({
    Name: 'ChangeRandomState',
    Fields: {
        StateIds: createArrayScheme({
            Element: stateIdScheme,
        }),
    },
    Filters: [EActionFilter.FlowList],
    Tip: '随机选择一个状态进行跳转',
});
