/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import {
    Actor,
    Guid,
    LinearColor,
    MaterialInstanceDynamic,
    PrimitiveComponent,
    StaticMeshComponent,
    Vector,
} from 'ue';

import { toVector } from '../../Common/Interface';
import { error, log } from '../../Common/Log';
import { IActionInfo, ISimpleMove } from '../Flow/Action';
import { Entity, gameContext, InteractiveComponent, ITickable } from '../Interface';
import { ITrampleActions, ITrampleComponent } from '../Scheme/Component/TrampleComponentScheme';
import { ActionRunnerComponent, ActionRunnerHandler } from './ActionRunnerComponent';

interface ISimpleMoveInfo {
    Who: Actor;
    Speed: Vector;
    Time: number;
    TargetPos: Vector;
}

export class TrampleComponent extends InteractiveComponent implements ITrampleComponent, ITickable {
    public IsDisposable: boolean;

    public TriggerActions: ITrampleActions;

    public RecoveryActions: ITrampleActions;

    private InteractingList: Guid[];

    private ActionRunner: ActionRunnerComponent;

    private Handler: ActionRunnerHandler;

    private MoveInfo: ISimpleMoveInfo;

    public OnInit(): void {
        this.ActionRunner = this.Entity.GetComponent(ActionRunnerComponent);
        this.IsDisposable = false;
        this.InteractingList = [];
        this.ActionRunner.RegisterActionFun('SimpleMove', this.ExecuteMoveToPos.bind(this));
    }

    public OnStart(): void {
        const component = this.Entity.Actor.GetComponentByClass(
            StaticMeshComponent.StaticClass(),
        ) as StaticMeshComponent;
        component.CreateAndSetMaterialInstanceDynamic(0);
    }

    public EventHit(
        myComp: PrimitiveComponent,
        otherComp: PrimitiveComponent,
        normalImpulse: Vector,
    ): void {}

    private async DoTrigger(): Promise<void> {
        await this.Handler.Execute();
    }

    public RunActions(actions: IActionInfo[]): void {
        if (this.Handler?.IsRunning) {
            this.Handler.Stop();
        }
        this.Handler = this.ActionRunner.SpawnHandler(actions);
        void this.DoTrigger();
    }

    public OnTriggerEnter(other: Entity): void {
        if (!this.InteractingList.includes(other.Actor.ActorGuid)) {
            this.InteractingList.push(other.Actor.ActorGuid);
            if (this.InteractingList.length === 1) {
                const color = new LinearColor(0.5, 0.5, 0, 1);
                this.ChangeMaterialColor(color);
                this.RunActions(this.TriggerActions.Actions);
                log(`OnTriggerEnter`);
            }
        }
    }

    public OnTriggerExit(other: Entity): void {
        const index = this.InteractingList.indexOf(other.Actor.ActorGuid);
        if (index >= 0) {
            this.InteractingList.splice(index, 1);
        }
        if (!this.IsDisposable && this.InteractingList.length === 0) {
            const color = new LinearColor(0, 0.2, 0.2, 1);
            this.ChangeMaterialColor(color);
            this.RunActions(this.RecoveryActions.Actions);
            log(`OnTriggerEnter`);
        }
    }

    public ChangeMaterialColor(color: LinearColor): void {
        const component = this.Entity.Actor.GetComponentByClass(
            StaticMeshComponent.StaticClass(),
        ) as StaticMeshComponent;
        if (component) {
            const material = component.GetMaterial(0) as MaterialInstanceDynamic;
            material.SetVectorParameterValue(`SurfaceColor`, color);
        }
    }

    public ExecuteMoveToPos(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as ISimpleMove;
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
