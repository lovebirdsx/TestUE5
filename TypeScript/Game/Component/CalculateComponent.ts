/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable spellcheck/spell-checker */
import {
    ICallByCondition,
    ICallFunction,
    ICondition,
    IConditions,
    IDoCalculate,
    IFunction,
    INumberVar,
    TVar,
} from '../Flow/Action';
import { Action, actionRegistry } from '../Flow/ActionRunner';
import { Component, ICalculatorComponent as ICalculateComponent } from '../Interface';
import { StateComponent } from './StateComponent';

export class CalculateComponent extends Component implements ICalculateComponent {
    public readonly Vars: INumberVar[];

    public readonly Functions: IFunction[];

    private readonly VarMap: Map<string, number> = new Map();

    private readonly FunctionMap: Map<string, IFunction> = new Map();

    private readonly FucntionActionsMap: Map<string, Action[]> = new Map();

    private ModifiedVars: INumberVar[];

    private StateComponent: StateComponent;

    public OnInit(): void {
        this.Vars.forEach((v) => this.VarMap.set(v.Name, v.Value));
        this.Functions.forEach((v) => this.FunctionMap.set(v.Name, v));

        this.StateComponent = this.Entity.GetComponent(StateComponent);
    }

    public OnLoadState(): void {
        this.ModifiedVars = this.StateComponent.GetState<INumberVar[]>('ModifiedVars') || [];
        this.ModifiedVars.forEach((v) => this.VarMap.set(v.Name, v.Value));
    }

    public SetVar(name: string, value: TVar): void {
        if (!this.VarMap.has(name)) {
            throw new Error(`${this.Name} modify no exist var ${name} = ${value}`);
        }

        this.VarMap.set(name, this.GetVarValue(value));
    }

    public GetVarValue(v: TVar): number {
        if (typeof v === 'number') {
            return v;
        }

        if (!this.VarMap.has(v)) {
            throw new Error(`${this.Name} get no exist var ${v}`);
        }

        return this.VarMap.get(v);
    }

    public DoCalculate(calculate: IDoCalculate): void {
        const v1 = this.GetVarValue(calculate.Var1);
        const v2 = this.GetVarValue(calculate.Var2);
        switch (calculate.Op) {
            case 'Add':
                this.SetVar(calculate.Result, v1 + v2);
                break;
            case 'Sub':
                this.SetVar(calculate.Result, v1 - v2);
                break;
            case 'Mut':
                this.SetVar(calculate.Result, v1 * v2);
                break;
            case 'Div':
                this.SetVar(calculate.Result, v1 / v2);
                break;
        }
    }

    private GetFunction(name: string): IFunction {
        if (!this.FunctionMap.has(name)) {
            throw new Error(`${this.Name} has no function ${name}`);
        }
        return this.FunctionMap.get(name);
    }

    private GetActions(name: string): Action[] {
        let actions = this.FucntionActionsMap.get(name);
        if (!actions) {
            actions = this.GetFunction(name).Actions.map((actionInfo) => {
                return actionRegistry.SpawnAction(actionInfo, this.Entity);
            });
            this.FucntionActionsMap.set(name, actions);
        }
        return actions;
    }

    public CallFunction(call: ICallFunction): void {
        const actions = this.GetActions(call.Name);
        actions.forEach((action) => {
            action.Execute();
        });
    }

    private IsConditionOk(condition: ICondition): boolean {
        const v1 = this.GetVarValue(condition.Var1);
        const v2 = this.GetVarValue(condition.Var2);
        switch (condition.Compare) {
            case 'Eq':
                return v1 === v2;
            case 'Ge':
                return v1 >= v2;
            case 'Gt':
                return v1 > v2;
            case 'Le':
                return v1 <= v2;
            case 'Lt':
                return v1 < v2;
            case 'Ne':
                return v1 !== v2;
            default:
                return false;
        }
    }

    private IsConditionsOk(conditions: IConditions): boolean {
        if (conditions.LogicOpType === 'And') {
            for (let i = 0; i < conditions.Conditions.length; i++) {
                const condition = conditions.Conditions[i];
                if (!this.IsConditionOk(condition)) {
                    return false;
                }
            }
            return true;
        }

        if (conditions.LogicOpType === 'Or') {
            for (let i = 0; i < conditions.Conditions.length; i++) {
                const condition = conditions.Conditions[i];
                if (this.IsConditionOk(condition)) {
                    return true;
                }
            }
            return false;
        }

        return false;
    }

    public CallByCondition(call: ICallByCondition): void {
        if (this.IsConditionsOk(call.Conditions)) {
            call.TrueActions?.forEach((actionInfo) => {
                const action = actionRegistry.SpawnAction(actionInfo, this.Entity);
                action.Execute();
            });
        } else {
            call.FalseActions?.forEach((actionInfo) => {
                const action = actionRegistry.SpawnAction(actionInfo, this.Entity);
                action.Execute();
            });
        }
    }
}
