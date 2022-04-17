import { Component } from '../../Common/Entity';
import { error, log } from '../../Common/Log';
import { flowListOp } from '../Common/Operations/FlowList';
import { IFlowComponent } from '../Entity/Interface';
import {
    IActionInfo,
    IChangeState,
    IFlowInfo,
    IFlowListInfo,
    IPlayFlow,
    IShowTalk,
} from '../Flow/Action';
import { ActionRunnerComponent, ActionRunnerHandler } from './ActionRunnerComponent';
import { TalkComponent } from './TalkComponent';

export class FlowComponent extends Component implements IFlowComponent {
    public InitState: IPlayFlow;

    private StateId: number;

    private ActionRunner: ActionRunnerComponent;

    private Talk: TalkComponent;

    private Handler: ActionRunnerHandler;

    private FlowInfo: IFlowInfo;

    private FlowListInfo: IFlowListInfo;

    public OnInit(): void {
        this.ActionRunner = this.Entity.GetComponent(ActionRunnerComponent);
        this.Talk = this.Entity.GetComponent(TalkComponent);

        this.StateId = this.InitState.StateId;
        this.FlowListInfo = flowListOp.LoadByName(this.InitState.FlowListName);
        this.FlowInfo = this.FlowListInfo.Flows.find((flow) => flow.Id === this.InitState.FlowId);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
        this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));
    }

    private ExecuteChangeState(actionInfo: IActionInfo): void {
        const changeState = actionInfo.Params as IChangeState;
        this.StateId = changeState.StateId;
    }

    private ExecuteFinishState(actionInfo: IActionInfo): void {
        this.Handler.Stop();
        this.Handler = undefined;
    }

    private async ExecuteShowTalk(actionInfo: IActionInfo): Promise<void> {
        const showTalk = actionInfo.Params as IShowTalk;
        await this.Talk.Show(this.FlowListInfo, showTalk);
    }

    public async Run(): Promise<void> {
        if (this.Handler) {
            error(`${this.Name} Can not run again`);
            return;
        }

        const state = this.FlowInfo.States.find((state0) => state0.Id === this.StateId);
        if (!state) {
            error(`[${this.FlowInfo.Name}] no state for id [${this.StateId}]`);
            return;
        }

        log(`[${this.Name}][${this.FlowInfo.Name}] to state [${state.Name}]`);

        this.Handler = this.ActionRunner.SpawnHandler(state.Actions);
        await this.Handler.Execute();
    }
}
