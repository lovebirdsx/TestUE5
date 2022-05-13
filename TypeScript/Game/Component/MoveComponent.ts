/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import {
    AIController,
    AIRequestID,
    Character,
    EPathFollowingRequestResult,
    EPathFollowingResult,
} from 'ue';

import { createCancleableDelay, createSignal, ISignal } from '../../Common/Async';
import { toVector } from '../../Common/Interface';
import { warn } from '../../Common/Log';
import { calUpRotatorByPoints } from '../../Common/Util';
import { IFaceToPos, IMoveToPos } from '../Flow/Action';
import { Component, DEFAULT_INIT_SPEED, gameContext, IMoveComponent } from '../Interface';
import StateComponent from './StateComponent';

class MoveComponent extends Component implements IMoveComponent {
    public InitSpeed: number = DEFAULT_INIT_SPEED;

    private Controller: AIController;

    private State: StateComponent;

    private MoveFinishSignal: ISignal<boolean>;

    private IsMoving = false;

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);

        const character = this.Entity.Actor as Character;
        this.Controller = character.Controller as AIController;
        character.CharacterMovement.MaxWalkSpeed = this.InitSpeed;
        this.Controller.ReceiveMoveCompleted.Add(this.OnMoveCompleted);
    }

    public OnLoadState(): void {
        this.State.ApplyPosition();
        this.State.ApplyRotation();
    }

    public OnDestroy(): void {
        // 在Destroy时,Controller的UE对象已经被销毁
        // 所以不能在此引用Controller对象
        if (this.IsMoving) {
            // 确保等待中的回调都被正常处理
            this.MoveFinishSignal.Emit(false);
        }
    }

    private readonly OnMoveCompleted = (
        requestId: AIRequestID,
        result: EPathFollowingResult,
    ): void => {
        if (this.MoveFinishSignal) {
            this.MoveFinishSignal.Emit(true);
        }
        this.State.RecordPosition();
    };

    public StopMove(): void {
        if (!this.IsMoving) {
            return;
        }

        this.Controller.StopMovement();
    }

    public async MoveToPos(action: IMoveToPos): Promise<void> {
        if (this.IsMoving) {
            throw new Error(`[${this.Name}] can not move again while already in move`);
        }

        const result = this.Controller.MoveToLocation(toVector(action.Pos));
        if (result !== EPathFollowingRequestResult.RequestSuccessful) {
            warn(`[${this.Name}] Move to ${JSON.stringify(action.Pos)} failed : [${result}]`);
            return;
        }

        this.IsMoving = true;

        // 超时自动完成
        const moveDelay = createCancleableDelay(action.Timeout);

        // 等待移动完毕
        this.MoveFinishSignal = createSignal<boolean>();
        await Promise.race([moveDelay.Promise, this.MoveFinishSignal.Promise]);

        if (this.MoveFinishSignal.IsEmit()) {
            moveDelay.Cancel();
        } else {
            this.Controller.StopMovement();
            this.MoveFinishSignal = undefined;
        }

        this.IsMoving = false;
    }

    public async FaceToPos(action: IFaceToPos): Promise<void> {
        const self = this.Entity.Actor;
        const targetRotator = calUpRotatorByPoints(
            self.K2_GetActorLocation(),
            toVector(action.Pos),
        );
        await gameContext.TweenManager.RotatoToByZ(self, targetRotator, 0.5);
    }
}

export default MoveComponent;
