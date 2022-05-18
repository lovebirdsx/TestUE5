/* eslint-disable spellcheck/spell-checker */
// eslint-disable-next-line prettier/prettier
import { Vector } from "ue";

import { toVector } from '../../Common/Interface';
import { error } from '../../Common/Log';
import { ISimpleMove } from '../Flow/Action';
import { Component, gameContext, ITickable } from '../Interface';
import { StateComponent } from './StateComponent';

export interface ISimpleMoveInfo {
    Speed: Vector;
    Time: number;
    TargetPos: Vector;
}

export class SimpleComponent extends Component implements ITickable {
    private readonly MoveInfo: Map<string, ISimpleMoveInfo> = new Map();

    public SimpleMove(action: ISimpleMove): void {
        const tsEntity = gameContext.EntityManager.GetEntity(action.Who);
        if (!tsEntity) {
            error(`没选定对象`);
            return;
        }
        const vector = toVector(action.Pos);
        const offset = vector.op_Subtraction(tsEntity.K2_GetActorLocation());
        const speed = offset.op_Division(action.UseTime);
        const moveinfo: ISimpleMoveInfo = {
            Speed: speed,
            Time: action.UseTime,
            TargetPos: vector,
        };
        this.MoveInfo.set(action.Who, moveinfo);
        if (!gameContext.TickManager.HasTick(this)) {
            gameContext.TickManager.AddTick(this);
        }
    }

    public Tick(deltaTime: number): void {
        const delList = [];
        this.MoveInfo.forEach((moveinfo, who) => {
            const tsEntity = gameContext.EntityManager.GetEntity(who);
            const time = moveinfo.Time;
            if (!tsEntity) {
                delList.push(who);
            } else {
                if (time - deltaTime <= 0) {
                    delList.push(who);
                    const stateComponent = tsEntity.Entity.TryGetComponent(StateComponent);
                    if (stateComponent) {
                        stateComponent.RecordPosition();
                    }
                } else {
                    const location = tsEntity.K2_GetActorLocation();
                    if (location !== moveinfo.TargetPos) {
                        const offset = moveinfo.Speed.op_Multiply(deltaTime);
                        const newLocation = tsEntity.K2_GetActorLocation().op_Addition(offset);
                        tsEntity.K2_SetActorLocation(newLocation, false, null, false);
                        moveinfo.Time = time - deltaTime;
                    }
                }
            }
        });
        delList.forEach((who) => {
            this.MoveInfo.delete(who);
        });
        if (this.MoveInfo.size <= 0) {
            gameContext.TickManager.RemoveTick(this);
        }
    }
}
