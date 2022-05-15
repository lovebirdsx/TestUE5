/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-void */
import { error } from '../../Common/Log';
import { flowListOp } from '../Common/Operations/FlowList';
import { IFlowInfo, IFlowListInfo, IPlayFlow, IShowTalk } from '../Flow/Action';
import { ActionRunner } from '../Flow/ActionRunner';
import { Component, IFlowComponent } from '../Interface';
import { BehaviorFlowComponent } from './BehaviorFlowComponent';
import { StateComponent } from './StateComponent';
import { TalkComponent } from './TalkComponent';

export class FlowComponent extends Component implements IFlowComponent {
    public readonly InitState: IPlayFlow;

    private StateId: number;

    private ActionId: number;

    private Runner: ActionRunner;

    private TalkComponent: TalkComponent;

    private BehaviorFlow: BehaviorFlowComponent;

    private StateComponent: StateComponent;

    private FlowInfo: IFlowInfo;

    private FlowListInfo: IFlowListInfo;

    public OnInit(): void {
        if (!this.InitState) {
            return;
        }

        this.BehaviorFlow = this.Entity.GetComponent(BehaviorFlowComponent);
        this.TalkComponent = this.Entity.GetComponent(TalkComponent);
        this.StateComponent = this.Entity.GetComponent(StateComponent);
        this.FlowListInfo = flowListOp.LoadByName(this.InitState.FlowListName);
        this.FlowInfo = this.FlowListInfo.Flows.find((flow) => flow.Id === this.InitState.FlowId);
    }

    public OnLoadState(): void {
        if (!this.InitState) {
            return;
        }

        this.StateId = this.StateComponent.GetState<number>('StateId') || this.InitState.StateId;
        this.ActionId = this.StateComponent.GetState<number>('ActionId') || 0;
    }

    public OnDestroy(): void {
        // 不能在此处停止Runner, 因为调用OnDestroy时, UE的相关组件已经失效了
        // 而Runner中的Stop, 会访问到相关的组件(譬如CharacterMoveComponent)
        // if (this.IsRunning) {
        //     this.Runner.Stop();
        //     this.Runner = undefined;
        // }
    }

    public ChangeState(stateId: number): void {
        this.StateId = stateId;
        this.StateComponent.SetState('StateId', this.StateId);
    }

    public FinishState(): void {
        this.Runner.Stop();
        this.Runner = undefined;
    }

    public async ShowTalk(data: IShowTalk): Promise<void> {
        await this.TalkComponent.Show(this.FlowListInfo, data);
    }

    public get IsRunning(): boolean {
        return this.Runner !== undefined;
    }

    public async Run(): Promise<void> {
        if (!this.InitState) {
            return;
        }

        if (this.Runner) {
            error(`${this.Name} Can not run again`);
            return;
        }

        const state = this.FlowInfo.States.find((state0) => state0.Id === this.StateId);
        if (!state) {
            error(`[${this.FlowInfo.Name}] no state for id [${this.StateId}]`);
            return;
        }

        this.BehaviorFlow.SetPausedByFlow(true);

        this.Runner = new ActionRunner('Flow', this.Entity, state.Actions);
        await this.Runner.Execute(this.ActionId, (actionId: number) => {
            this.ActionId = actionId + 1;
            this.StateComponent.SetState('ActionId', this.ActionId);
        });

        if (!this.Runner.IsInterrupt) {
            this.ActionId = 0;
            this.StateComponent.SetState('ActionId', undefined);
        }

        this.BehaviorFlow.SetPausedByFlow(false);

        this.Runner = undefined;
    }
}
