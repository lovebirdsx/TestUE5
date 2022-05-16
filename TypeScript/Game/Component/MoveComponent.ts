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
import { IFaceToPos, IMoveToPosA } from '../Flow/Action';
import { Component, DEFAULT_INIT_SPEED, gameContext, IMoveComponent } from '../Interface';
import { TweenItem } from '../Manager/TweenManager';
import { StateComponent } from './StateComponent';

type TMoveStopType = 'cancel' | 'normal' | 'timeout';

export class MoveComponent extends Component implements IMoveComponent {
    public InitSpeed: number = DEFAULT_INIT_SPEED;

    private Controller: AIController;

    private State: StateComponent;

    private MoveFinishSignal: ISignal<TMoveStopType>;

    private RotatoTween: TweenItem<number>;

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
        // 确保等待中的回调都被正常处理
        this.Stop();
    }

    private readonly OnMoveCompleted = (
        requestId: AIRequestID,
        result: EPathFollowingResult,
    ): void => {
        if (this.MoveFinishSignal) {
            this.MoveFinishSignal.Emit('normal');
            // Signal发出之后马上清除, 避免被再次调用
            this.MoveFinishSignal = undefined;
        }
        this.State.RecordPosition();
        this.State.RecordRotation();
    };

    public Stop(): void {
        if (this.MoveFinishSignal) {
            this.MoveFinishSignal.Emit('cancel');
            // Signal发出之后马上清除, 避免被再次调用
            this.MoveFinishSignal = undefined;
        }

        if (this.RotatoTween) {
            this.RotatoTween.Stop();
        }
    }

    public async MoveToPos(action: IMoveToPosA): Promise<void> {
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
        const moveDelay = createCancleableDelay<TMoveStopType>(action.Timeout, 'timeout');

        // 等待移动完毕
        this.MoveFinishSignal = createSignal<TMoveStopType>();
        const stopType = await Promise.race([moveDelay.Promise, this.MoveFinishSignal.Promise]);
        this.MoveFinishSignal = undefined;

        switch (stopType) {
            case 'cancel':
                moveDelay.Cancel();
                // 若在OnDestroy调用时, Controller已经被销毁, 故而需要加入该判断
                if (this.IsValid) {
                    this.Controller.StopMovement();
                }
                break;
            case 'normal':
                moveDelay.Cancel();
                await this.FaceToZAngle(action.Pos.A | 0);
                break;
            case 'timeout':
                if (this.IsValid) {
                    this.Controller.StopMovement();
                }
                await this.FaceToZAngle(action.Pos.A | 0);
                break;
            default:
                break;
        }

        this.IsMoving = false;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    private async FaceToZAngle(angle: number): Promise<void> {
        if (this.RotatoTween) {
            throw new Error(`${this.Name} can not run face to z animation twice`);
        }

        this.RotatoTween = gameContext.TweenManager.AddRotatoByZ(this.Entity.Actor, angle, 0.5);
        const signal = createSignal();
        this.RotatoTween.FinishCallback = (): void => {
            signal.Emit(undefined);
        };
        await signal.Promise;
        this.RotatoTween = undefined;
    }

    public async FaceToPos(action: IFaceToPos): Promise<void> {
        const self = this.Entity.Actor;
        const targetRotator = calUpRotatorByPoints(
            self.K2_GetActorLocation(),
            toVector(action.Pos),
        );
        await this.FaceToZAngle(targetRotator.Euler().Z);
    }
}
