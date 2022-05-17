/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-void */

import { Component } from '../Interface';
import { StateComponent } from './StateComponent';

export class SpringBoardComponent extends Component {
    private State: StateComponent;

    private StateId = 0;

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);
    }

    public OnLoadState(): void {
        this.StateId = this.State.GetState<number>('StateId') || 0;
    }

    public OnStart(): void {
        this.State.ApplyPosition();
    }
}
