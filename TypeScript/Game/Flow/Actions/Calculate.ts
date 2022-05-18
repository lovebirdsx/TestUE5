import { CalculateComponent } from '../../Component/CalculateComponent';
import {
    ICallByCondition,
    ICallFunction,
    IDoCalculate,
    ISetNumberVar,
    ISyncVarToActorState,
} from '../Action';
import { Action } from '../ActionRunner';

export class SetNumberVarAction extends Action<ISetNumberVar> {
    public Execute(): void {
        const calculate = this.Entity.GetComponent(CalculateComponent);
        calculate.SetVar(this.Data.Name, this.Data.Value);
    }
}

export class SyncVarToActorStateAction extends Action<ISyncVarToActorState> {
    public Execute(): void {
        const calculate = this.Entity.GetComponent(CalculateComponent);
        calculate.SyncVarToActorState(this.Data);
    }
}

export class DoCalculateAction extends Action<IDoCalculate> {
    public Execute(): void {
        const calculate = this.Entity.GetComponent(CalculateComponent);
        calculate.DoCalculate(this.Data);
    }
}

export class CallFunctionAction extends Action<ICallFunction> {
    public Execute(): void {
        const calculate = this.Entity.GetComponent(CalculateComponent);
        calculate.CallFunction(this.Data);
    }
}

export class CallByConditionAction extends Action<ICallByCondition> {
    public Execute(): void {
        const calculate = this.Entity.GetComponent(CalculateComponent);
        calculate.CallByCondition(this.Data);
    }
}
