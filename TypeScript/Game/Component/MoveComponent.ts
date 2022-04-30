/* eslint-disable spellcheck/spell-checker */
import {
    AIController,
    AIRequestID,
    Character,
    EPathFollowingRequestResult,
    EPathFollowingResult,
} from 'ue';

import { createCancleableDelay, createSignal, ISignal } from '../../Common/Async';
import { warn } from '../../Common/Log';
import { IActionInfo, IMoveToPos, toVector } from '../Flow/Action';
import { Component } from '../Interface';
import { ActionRunnerComponent } from './ActionRunnerComponent';

class MoveComponent extends Component {
    private Runner: ActionRunnerComponent;

    private Controller: AIController;

    private MoveFinishSignal: ISignal<void>;

    private IsMoving = false;

    public OnInit(): void {
        this.Runner = this.Entity.GetComponent(ActionRunnerComponent);
        this.Runner.RegisterActionFun('MoveToPos', this.ExecuteMoveToPos.bind(this));
        this.Controller = (this.Entity.Actor as Character).Controller as AIController;
        this.Controller.ReceiveMoveCompleted.Add(this.OnMoveCompleted);
    }

    public OnDestroy(): void {
        this.Controller.ReceiveMoveCompleted.Remove(this.OnMoveCompleted);
    }

    private readonly OnMoveCompleted = (
        requestId: AIRequestID,
        result: EPathFollowingResult,
    ): void => {
        if (this.MoveFinishSignal) {
            this.MoveFinishSignal.Emit();
        }
    };

    private async ExecuteMoveToPos(actionInfo: IActionInfo): Promise<void> {
        if (this.IsMoving) {
            throw new Error(`[${this.Name}] can not move again while already in move`);
        }

        const action = actionInfo.Params as IMoveToPos;
        const result = this.Controller.MoveToLocation(toVector(action.Pos));
        if (result !== EPathFollowingRequestResult.RequestSuccessful) {
            warn(`[${this.Name}] Move to ${JSON.stringify(action.Pos)} failed : [${result}]`);
            return;
        }

        this.IsMoving = true;

        // 超时自动完成
        const moveDelay = createCancleableDelay(action.Timeout);

        // 等待移动完毕
        this.MoveFinishSignal = createSignal();
        await Promise.race([moveDelay.Promise, this.MoveFinishSignal.Promise]);

        if (this.MoveFinishSignal.IsEmit()) {
            moveDelay.Cancel();
        } else {
            this.Controller.StopMovement();
            this.MoveFinishSignal = undefined;
        }

        this.IsMoving = false;
    }
}

export default MoveComponent;
