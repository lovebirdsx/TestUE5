/* eslint-disable spellcheck/spell-checker */
import { IFunction, INumberVar } from '../Flow/Action';
import { Component, ICalculatorComponent as ICalculateComponent } from '../Interface';

export class CalculateComponent extends Component implements ICalculateComponent {
    public readonly Vars: INumberVar[];

    public readonly Functions: IFunction[];
}
