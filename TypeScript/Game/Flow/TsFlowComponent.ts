import { ActorComponent, no_blueprint } from 'ue';

import { log } from '../../Editor/Common/Log';
import TsEntity from '../Entity/TsEntity';
import { IActionInfo, IChangeState, IFinishState } from './Action';
import TsActionRunnerComponent from './TsActionRunnerComponent';

class TsFlowComponent extends ActorComponent {
    public ReceiveBeginPlay(): void {
        const entity = this.GetOwner() as TsEntity;
        const actionRunner = entity.GetComponentByTsClass(TsActionRunnerComponent);
        actionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        actionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
    }

    @no_blueprint()
    private ExecuteChangeState(action: IActionInfo): void {
        const changeStateAction = action.Params as IChangeState;
        this.ChangeState(changeStateAction.StateId);
    }

    @no_blueprint()
    private ExecuteFinishState(action: IActionInfo): void {
        this.FinishState(action.Params as IFinishState);
    }

    @no_blueprint()
    private ChangeState(id: number): void {
        log(`${this.GetName()} state change to [${id}]`);
    }

    @no_blueprint()
    private FinishState(action: IFinishState): void {
        log(`${this.GetName()} finish state: [${action.Result}] [${action.Arg1}] [${action.Arg2}]`);
    }
}

export default TsFlowComponent;
