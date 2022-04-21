/* eslint-disable spellcheck/spell-checker */
import {
    ArrayScheme,
    EActionFilter,
    IntScheme,
    ObjectScheme,
    Scheme,
    TObjectFields,
} from '../../../../Common/Type';
import { IChangeRandomState, IChangeState } from '../../../../Game/Flow/Action';

export class FinishStateScheme extends ObjectScheme<Record<string, unknown>> {
    public Fields: TObjectFields<Record<string, unknown>> = {};

    public Filters: EActionFilter[] = [EActionFilter.FlowList];

    public Tip?: string = '结束状态,后续的动作将不被执行';
}

const DEFAULT_STATE_ID = 1;

export class StateIdScheme extends IntScheme {
    public CreateDefault(): number {
        return DEFAULT_STATE_ID;
    }
}

export class ChangeStateScheme extends ObjectScheme<IChangeState> {
    public Fields: TObjectFields<IChangeState> = {
        StateId: new StateIdScheme(),
    };

    public Filters: EActionFilter[] = [EActionFilter.FlowList];

    public Tip?: string = '改变Entity的状态,下一次再和实体交互,则将从此设定的状态开始';
}

export class StateIdsScheme extends ArrayScheme<number> {
    public Element: Scheme<number> = new StateIdScheme();
}

export class ChangeRandomStateScheme extends ObjectScheme<IChangeRandomState> {
    public Fields: TObjectFields<IChangeRandomState> = {
        StateIds: new StateIdsScheme(),
    };

    public Filters: EActionFilter[] = [EActionFilter.FlowList];

    public Tip?: string = '随机选择一个状态进行跳转';
}
