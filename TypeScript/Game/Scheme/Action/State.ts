/* eslint-disable spellcheck/spell-checker */
import {
    createArrayScheme,
    createBooleanScheme,
    createEnumScheme,
    createIntScheme,
    createObjectScheme,
    EActionFilter,
} from '../../../Common/Type';
import {
    actorStateConfig,
    IChangeActorState,
    IChangeBehaviorState,
    IChangeRandomState,
    IChangeState,
    ISetBehaviorPaused,
} from '../../Flow/Action';

export const finishStateScheme = createObjectScheme({
    CnName: '结束状态',
    Filters: [EActionFilter.FlowList],
    Tip: '结束状态,后续的动作将不被执行',
});

const DEFAULT_STATE_ID = 1;

export const stateIdScheme = createIntScheme({
    Name: 'StateId',
    CreateDefault: () => DEFAULT_STATE_ID,
});

export const changeStateScheme = createObjectScheme<IChangeState>({
    CnName: '改变状态',
    Name: 'ChangeState',
    Fields: {
        StateId: stateIdScheme,
    },
    Filters: [EActionFilter.FlowList, EActionFilter.Talk, EActionFilter.Invoke],
    Tip: '改变Entity的状态,下一次再和实体交互,则将从此设定的状态开始',
});

export const changeBehaviorStateScheme = createObjectScheme<IChangeBehaviorState>({
    CnName: '改变Behaivor状态',
    Name: 'ChangeBehaviorState',
    Fields: {
        StateId: stateIdScheme,
        IsInstant: createBooleanScheme({
            CnName: '立即模式',
            Optional: true,
            Tip: '是否立即执行, 如果立即执行, 则将停止当前状态, 马上执行下一状态',
        }),
    },
    Filters: [EActionFilter.BehaviorFlow, EActionFilter.Invoke],
    Tip: '改变行为状态, 实体将从该状态继续执行动作',
});

export const setBehaviorIsPausedScheme = createObjectScheme<ISetBehaviorPaused>({
    CnName: '设定Behaivor是否暂停',
    Name: 'SetBehaviorIsPaused',
    Fields: {
        IsPaused: createBooleanScheme({
            CnName: '是否暂停',
            Optional: true,
            Tip: '是否暂停',
        }),
    },
    Filters: [EActionFilter.BehaviorFlow, EActionFilter.Invoke],
    Tip: '设定是否暂停Behavior的执行',
});

export const changeRandomStateScheme = createObjectScheme<IChangeRandomState>({
    Name: 'ChangeRandomState',
    CnName: '随机改变状态',
    Fields: {
        StateIds: createArrayScheme({
            Element: stateIdScheme,
        }),
    },
    Filters: [EActionFilter.FlowList],
    Tip: '随机选择一个状态进行跳转',
});

export const changeActorStateScheme = createObjectScheme<IChangeActorState>({
    Name: 'ChangeActorState',
    CnName: '改变Actor状态',
    Fields: {
        State: createEnumScheme({
            Config: actorStateConfig,
        }),
    },
    Filters: [EActionFilter.Trigger, EActionFilter.Invoke, EActionFilter.Function],
    Tip: '让目标Actor改变状态',
});
