import { error, log } from '../../Editor/Common/Log';
import TsEntity from '../Entity/TsEntity';
import TsEntityComponent from '../Entity/TsEntityComponent';
import { IActionInfo, IChangeState, IFinishState, IFlowInfo } from './Action';
import TsActionRunnerComponent from './TsActionRunnerComponent';

class TsFlowComponent extends TsEntityComponent {
    // @no-blueprint
    private Flow: IFlowInfo;

    // @no-blueprint
    private ActionRunner: TsActionRunnerComponent;

    // @no-blueprint
    private StateId: number;

    public ReceiveBeginPlay(): void {
        const entity = this.GetOwner() as TsEntity;
        this.ActionRunner = entity.GetComponentByTsClass(TsActionRunnerComponent);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
    }

    // @no-blueprint
    public Bind(flow: IFlowInfo): void {
        this.Flow = flow;
        this.StateId = 0;
    }

    // @no-blueprint
    private ExecuteChangeState(action: IActionInfo): void {
        const changeStateAction = action.Params as IChangeState;
        this.ChangeState(changeStateAction.StateId);
    }

    // @no-blueprint
    private ExecuteFinishState(action: IActionInfo): void {
        this.FinishState(action.Params as IFinishState);
    }

    // @no-blueprint
    private ChangeState(id: number): void {
        if (!this.Flow) {
            error(`${this.Name} has not flow`);
            return;
        }

        if (!this.ActionRunner.IsRunning) {
            error(`${this.Name} can not change state while not running`);
            return;
        }

        this.ActionRunner.Stop();
        this.StateId = id;

        const state = this.Flow.States[id];
        log(`${this.GetName()} state change to [${state.Name}]`);
    }

    // @no-blueprint
    private FinishState(action: IFinishState): void {
        log(`${this.GetName()} finish state: [${action.Result}] [${action.Arg1}] [${action.Arg2}]`);
    }

    // @no-blueprint
    public async Interact(): Promise<void> {
        let lastStateId = -1;
        while (lastStateId !== this.StateId) {
            lastStateId = this.StateId;
            const actions = this.Flow.States[lastStateId].Actions;
            // eslint-disable-next-line no-await-in-loop
            await this.ActionRunner.Execute(actions);
        }
    }
}

export default TsFlowComponent;
