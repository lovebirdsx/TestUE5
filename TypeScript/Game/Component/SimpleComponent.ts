// eslint-disable-next-line prettier/prettier
import { Actor, Vector } from "ue";

import { toVector } from '../../Common/Interface';
import { error, log } from '../../Common/Log';
import { ISimpleMove } from '../Flow/Action';
import { Component, gameContext, ITickable } from '../Interface';

export interface ISimpleMoveInfo {
    Who: Actor;
    Speed: Vector;
    Time: number;
    TargetPos: Vector;
}

export class SimpleComponent extends Component implements ITickable {
    private MoveInfo: ISimpleMoveInfo;

    public SimpleMove(action: ISimpleMove): void {
        log(`SimpleMove ${action.Who}`);
        const tsEntity = gameContext.EntityManager.GetEntity(action.Who);
        if (!tsEntity) {
            error(`没选定对象`);
            return;
        }
        const vector = toVector(action.Pos);
        const offset = vector.op_Subtraction(tsEntity.K2_GetActorLocation());
        const speed = offset.op_Division(action.UseTime);
        this.MoveInfo = {
            Who: tsEntity,
            Speed: speed,
            Time: action.UseTime,
            TargetPos: vector,
        };
        if (!gameContext.TickManager.HasTick(this)) {
            gameContext.TickManager.AddTick(this);
        }
    }

    public Tick(deltaTime: number): void {
        const time = this.MoveInfo.Time;
        if (time - deltaTime > 0) {
            const tsEntity = this.MoveInfo.Who;
            const location = tsEntity.K2_GetActorLocation();
            if (location !== this.MoveInfo.TargetPos) {
                const offset = this.MoveInfo.Speed.op_Multiply(deltaTime);
                const newLocation = tsEntity.K2_GetActorLocation().op_Addition(offset);
                tsEntity.K2_SetActorLocation(newLocation, false, null, false);
                this.MoveInfo.Time = time - deltaTime;
                return;
            }
        }
        gameContext.TickManager.RemoveTick(this);
    }
}
