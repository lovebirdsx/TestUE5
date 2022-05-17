/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable spellcheck/spell-checker */
import { log } from '../../Common/Log';
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

    private readonly ModifedVarMap: Map<string, number> = new Map();

    private readonly InitVarMap: Map<string, number> = new Map();

    private readonly FunctionMap: Map<string, IFunction> = new Map();

    private readonly FucntionActionsMap: Map<string, Action[]> = new Map();

    private StateComponent: StateComponent;

    public OnInit(): void {
        this.Vars.forEach((v) => {
            this.InitVarMap.set(v.Name, v.Value);
        });
        this.Functions.forEach((v) => this.FunctionMap.set(v.Name, v));

        this.StateComponent = this.Entity.GetComponent(StateComponent);
    }

    public OnLoadState(): void {
        // 加载修改的数据
        const modifiedVars = this.StateComponent.GetState<[string, number][]>('ModifiedVars');
        if (modifiedVars) {
            modifiedVars.forEach((v) => this.ModifedVarMap.set(v[0], v[1]));
        }
    }

    public SetVar(name: string, value: TVar): void {
        if (!this.InitVarMap.has(name)) {
            throw new Error(`${this.Name} modify no exist var ${name} = ${value}`);
        }

        const v = this.GetVarValue(value);
        if (this.InitVarMap.get(name) === v) {
            this.ModifedVarMap.delete(name);
        } else {
            this.ModifedVarMap.set(name, v);
        }

        // 保存修改的数据
        const modifiedVars = Array.from(this.ModifedVarMap.entries());
        this.StateComponent.SetState(
            'ModifiedVars',
            modifiedVars.length > 0 ? modifiedVars : undefined,
        );

        log(`${this.Name} ${name} = ${v}`);
    }

    public GetVarValue(v: TVar): number {
        if (typeof v === 'number') {
            return v;
        }

        if (!this.InitVarMap.has(v)) {
            throw new Error(`${this.Name} get no exist var ${v}`);
        }

        return this.ModifedVarMap.get(v) || this.InitVarMap.get(v);
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
        log(`${this.Name} call [${call.Name}]`);
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
