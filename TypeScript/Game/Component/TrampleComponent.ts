/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import {
    Guid,
    LinearColor,
    MaterialInstanceDynamic,
    PrimitiveComponent,
    StaticMeshComponent,
    Vector,
} from 'ue';

import { ActionRunner } from '../Flow/ActionRunner';
import { Entity, InteractiveComponent } from '../Interface';
import { IActionInfo } from '../Interface/Action';
import { ITrampleComponent } from '../Interface/Component';
import { StateComponent } from './StateComponent';

export class TrampleComponent extends InteractiveComponent implements ITrampleComponent {
    public IsDisposable: boolean;

    public TriggerActions: IActionInfo[];

    public RecoveryActions: IActionInfo[];

    private State: StateComponent;

    private InteractingList: Guid[];

    private Runner: ActionRunner;

    private TriggerTimes = 0;

    public OnInit(): void {
        this.InteractingList = [];
        this.State = this.Entity.GetComponent(StateComponent);
        const component = this.Entity.Actor.GetComponentByClass(
            StaticMeshComponent.StaticClass(),
        ) as StaticMeshComponent;
        component.CreateAndSetMaterialInstanceDynamic(0);
    }

    public OnStart(): void {
        if (this.TriggerTimes > 0 && this.IsDisposable) {
            const color = new LinearColor(0.5, 0.5, 0, 1);
            this.ChangeMaterialColor(color);
        }
    }

    public OnLoadState(): void {
        this.TriggerTimes = this.State.GetState<number>('TriggerTimes') || 0;
    }

    public EventHit(
        myComp: PrimitiveComponent,
        otherComp: PrimitiveComponent,
        normalImpulse: Vector,
    ): void {}

    private async DoTrigger(): Promise<void> {
        await this.Runner.Execute();
    }

    public RunActions(actions: IActionInfo[]): void {
        if (this.Runner?.IsRunning) {
            this.Runner.Stop();
        }
        this.Runner = new ActionRunner('Trample', this.Entity, actions);
        void this.DoTrigger();
    }

    public OnTriggerEnter(other: Entity): void {
        if (this.TriggerTimes > 0 && this.IsDisposable) {
            return;
        }
        if (!this.InteractingList.includes(other.Actor.ActorGuid)) {
            this.InteractingList.push(other.Actor.ActorGuid);
            if (this.InteractingList.length === 1) {
                const color = new LinearColor(0.5, 0.5, 0, 1);
                this.ChangeMaterialColor(color);
                this.RunActions(this.TriggerActions);
                this.TriggerTimes += 1;
                this.State.SetState('TriggerTimes', this.TriggerTimes);
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
            this.RunActions(this.RecoveryActions);
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
}
