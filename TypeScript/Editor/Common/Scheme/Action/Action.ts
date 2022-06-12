/* eslint-disable spellcheck/spell-checker */
import {
    IActionInfo,
    IJumpTalk,
    ILog,
    IShowTalk,
    TActionType,
} from '../../../../Game/Interface/IAction';
import { Scheme, TElementRenderType } from '../../Type';

export type TActionQueryType = 'custom' | 'entity';

export class ActionScheme extends Scheme<IActionInfo> {
    public CnName = '动作';

    public RenderType: TElementRenderType = 'dynamic';

    // 需要额外添加的动作
    public ExtraActions: TActionType[] = [];

    // 需要过滤掉的动作
    public FilterActions: TActionType[] = [];

    public NoIndent?: boolean;

    public CreateDefault(): IActionInfo {
        const logAction: ILog = {
            Level: 'Info',
            Content: 'Hello World',
        };

        return {
            Name: 'Log',
            Params: logAction,
        };
    }
}

export function createActionScheme(type: Partial<ActionScheme>): ActionScheme {
    const scheme = new ActionScheme();
    Object.assign(scheme, type);
    return scheme;
}

export const flowListActionScheme = createActionScheme({
    Name: 'FlowListAction',
    // ShowTalk和FinishState只能在FlowListAction中出现
    ExtraActions: ['ShowTalk', 'FinishState'],
    CreateDefault(): IActionInfo {
        const showTalk: IShowTalk = {
            TalkItems: [],
        };
        return {
            Name: 'ShowTalk',
            Params: showTalk,
        };
    },
});

export const talkActionScheme = createActionScheme({
    Name: 'TalkAction',
    // JumpTalk和FinishTalk只能在TalkAction中出现
    ExtraActions: ['JumpTalk', 'FinishTalk'],
    CreateDefault(): IActionInfo {
        const jumpTalk: IJumpTalk = {
            TalkId: 1,
        };
        return {
            Name: 'JumpTalk',
            Params: jumpTalk,
        };
    },
});

export const triggerActionScheme = createActionScheme({
    Name: 'TriggerAction',
});

export const trampleActionScheme = createActionScheme({
    Name: 'TrampleAction',
});

export const behaviorFlowActionScheme = createActionScheme({
    Name: 'BehaviorFlowAction',
    FilterActions: ['ChangeState', 'FinishState'],
});

export const functionActionScheme = createActionScheme({
    Name: 'FunctionAction',
});
