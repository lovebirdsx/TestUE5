/* eslint-disable spellcheck/spell-checker */
import { EActionFilter, Scheme, TElementRenderType } from '../../../Common/Type';
import { IActionInfo, IJumpTalk, ILog, IShowTalk } from '../../Flow/Action';

export class ActionScheme extends Scheme<IActionInfo> {
    public RenderType: TElementRenderType = 'dynamic';

    public Filter: EActionFilter = EActionFilter.FlowList;

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
    Filter: EActionFilter.FlowList,
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
    Filter: EActionFilter.Talk,
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
    Filter: EActionFilter.Trigger,
});

export const trampleActionScheme = createActionScheme({
    Name: 'TrampleAction',
    Filter: EActionFilter.Trample,
});

export const behaviorFlowActionScheme = createActionScheme({
    Name: 'BehaviorFlowAction',
    Filter: EActionFilter.BehaviorFlow,
});
