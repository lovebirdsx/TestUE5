/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createSignal, ISignal } from '../../Common/Async';
import { toTransformInfo } from '../../Common/Interface';
import { IVectorType } from '../../Common/Type';
import { Entity, gameContext, IInteractCall, InteractiveComponent } from '../Interface';
import { IInteract, ISpawn } from '../Interface/Action';
import { ISphereFactoryComponent } from '../Interface/Component';
import { EntitySpawnerComponent } from './EntitySpawnerComponent';
import { EventComponent } from './EventComponent';

export class SphereFactoryComponent
    extends InteractiveComponent
    implements ISphereFactoryComponent
{
    public SphereLocation: IVectorType; // 用自己位置

    public SphereGuid: string;

    private EntitySpawn: EntitySpawnerComponent;

    private Event: EventComponent;

    private InteractSignal: ISignal<boolean>;

    public OnInit(): void {
        this.InteractSignal = null;
        this.EntitySpawn = this.Entity.GetComponent(EntitySpawnerComponent);
        gameContext.EntityManager.EntityRemoved.AddCallback(this.OnEntityRemoved);
        this.Event = this.Entity.GetComponent(EventComponent);
        const interactCall: IInteractCall = {
            Name: 'SphereFactoryComponent',
            CallBack: (action: IInteract) => {
                this.Activate(action);
            },
        };
        this.Event.RegistryInteract(interactCall);
    }

    public OnDestroy(): void {
        gameContext.EntityManager.EntityRemoved.RemoveCallBack(this.OnEntityRemoved);
    }

    public OnLoadState(): void {
        this.EntitySpawn.DestroyAllChild();
    }

    private readonly OnEntityRemoved = (id: number): void => {
        if (!this.EntitySpawn.HasChild(id)) {
            return;
        }
        this.CreateSphere();
    };

    public CreateSphere(): void {
        const transformInfo = toTransformInfo(this.Entity.Actor.GetTransform());
        if (this.SphereGuid) {
            const spawn: ISpawn = {
                TemplateGuid: this.SphereGuid,
                Transform: transformInfo,
            };
            this.EntitySpawn.Spawn(spawn);
        }
    }

    public Activate(action: IInteract): void {
        const tsEntity = gameContext.EntityManager.GetEntity(action.Who);
        switch (action.Param) {
            case `1`:
                if (!this.InteractSignal) {
                    void this.StartInteract(tsEntity.Entity);
                }
                break;
            case `2`:
                if (this.InteractSignal !== null) {
                    this.InteractSignal.Emit(true);
                }
                break;
            case `3`:
                this.CreateSphere();
                break;
            default:
                break;
        }
    }

    public async StartInteract(entity: Entity): Promise<void> {
        this.CreateSphere();
        // 等待取消
        this.InteractSignal = createSignal<boolean>();

        await Promise.all([this.InteractSignal.Promise]);

        // 销毁小球
        this.EntitySpawn.DestroyAllChild();
        this.InteractSignal = null;
    }
}
