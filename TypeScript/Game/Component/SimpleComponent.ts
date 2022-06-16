/* eslint-disable spellcheck/spell-checker */
// eslint-disable-next-line prettier/prettier
import { $ref, $unref } from "puerts";
import { Actor, NewArray, StaticMeshComponent, Vector } from 'ue';

import { toVector } from '../../Common/Interface/Action';
import { ISimpleMove } from '../../Common/Interface/IAction';
import { error } from '../../Common/Misc/Log';
import { Component, gameContext, ITickable, ITsEntity } from '../Interface';
import { StateComponent, vectorToArray } from './StateComponent';

export interface ISimpleMoveInfo {
    Speed: Vector;
    Time: number;
    TargetPos: Vector;
}

export class SimpleComponent extends Component implements ITickable {
    private readonly MoveInfo: Map<number, ISimpleMoveInfo> = new Map();

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
        const stateComponent = tsEntity.Entity.TryGetComponent(StateComponent);
        if (stateComponent) {
            stateComponent.SetState('Pos', vectorToArray(vector));
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
                } else {
                    const location = tsEntity.K2_GetActorLocation();
                    if (location !== moveinfo.TargetPos) {
                        const offset = moveinfo.Speed.op_Multiply(deltaTime);
                        const newLocation = tsEntity.K2_GetActorLocation().op_Addition(offset);
                        tsEntity.K2_SetActorLocation(newLocation, false, undefined, false);
                        moveinfo.Time = time - deltaTime;
                        // 移动时更新附近物体的物理
                        this.WakeRigidBodies(tsEntity);
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

    public WakeRigidBodies(tsEntity: ITsEntity): void {
        const actorRef = $ref(NewArray(Actor));
        tsEntity.GetOverlappingActors(actorRef, Actor.StaticClass());
        const actors = $unref(actorRef);
        if (actors.Num() > 0) {
            for (let i = 0; i < actors.Num(); i++) {
                const actor = actors.Get(i);
                const component = actor.GetComponentByClass(
                    StaticMeshComponent.StaticClass(),
                ) as StaticMeshComponent;
                if (component?.IsSimulatingPhysics()) {
                    component.WakeAllRigidBodies();
                }
            }
        }
    }
}
