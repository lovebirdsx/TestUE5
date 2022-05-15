/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-void */
import { MaterialInstanceDynamic, StaticMeshComponent } from 'ue';

import { IInteract } from '../Flow/Action';
import { Component, IInteractCall } from '../Interface';
import { EventComponent } from './EventComponent';

export class LampComponent extends Component {
    private IsActive = false;

    public OnInit(): void {
        const event = this.Entity.GetComponent(EventComponent);
        const call: IInteractCall = {
            Name: 'GameModeComponent',
            CallBack: (action: IInteract) => {
                this.Activate(action);
            },
        };
        event.RegistryInteract(call);
    }

    public OnStart(): void {
        const component = this.Entity.Actor.GetComponentByClass(
            StaticMeshComponent.StaticClass(),
        ) as StaticMeshComponent;
        component.CreateAndSetMaterialInstanceDynamic(0);
    }

    public Activate(action: IInteract): void {
        if (!this.IsActive) {
            this.ChangeMaterialColor();
        }
        this.IsActive = true;
    }

    public ChangeMaterialColor(): void {
        const component = this.Entity.Actor.GetComponentByClass(
            StaticMeshComponent.StaticClass(),
        ) as StaticMeshComponent;
        if (component) {
            const material = component.GetMaterial(0) as MaterialInstanceDynamic;
            material.SetScalarParameterValue(`OpenLamp`, 1);
        }
    }
}
