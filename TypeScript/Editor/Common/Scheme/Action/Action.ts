import { EActionFilter, Scheme, TElementRenderType } from '../../../../Common/Type';
import { IActionInfo, ILog } from '../../../../Game/Flow/Action';

export abstract class ActionScheme extends Scheme<IActionInfo> {
    public RenderType: TElementRenderType = 'dynamic';

    public abstract Filter: EActionFilter;

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

export class FlowListActionScheme extends ActionScheme {
    public Filter: EActionFilter = EActionFilter.FlowList;
}

export class TalkActionScheme extends ActionScheme {
    public Filter: EActionFilter = EActionFilter.Talk;
}

export class TriggerActionScheme extends ActionScheme {
    public Filter: EActionFilter = EActionFilter.Trigger;
}
