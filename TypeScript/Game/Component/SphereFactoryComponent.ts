/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createSignal, ISignal } from '../../Common/Async';
import { toTransformInfo } from '../../Common/Interface';
import { IVectorType } from '../../Common/Type';
import { IInteract, ISpawn } from '../Flow/Action';
import { Entity, gameContext, IInteractCall, InteractiveComponent } from '../Interface';
import { ISphereFactoryComponent } from '../Scheme/Component/SphereFactoryScheme';
import { EntitySpawnerComponent, ICallBack } from './EntitySpawnerComponent';
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
        const call: ICallBack = {
            Name: 'SphereFactoryComponent',
            CallBack: (guid: string) => {
                this.CreateSphere();
            },
        };
        this.EntitySpawn.RegistryDestroy(call);
        this.Event = this.Entity.GetComponent(EventComponent);
        const interactCall: IInteractCall = {
            Name: 'SphereFactoryComponent',
            CallBack: (action: IInteract) => {
                this.Activate(action);
            },
        };
        this.Event.RegistryInteract(interactCall);
    }

    public OnLoadState(): void {
        this.EntitySpawn.DestroyAllChild();
    }

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
        //      检测小球掉落，则销毁
        //      interacting 再发射小球
        // 新action
        //   调用别的entity interact / interacting
        this.CreateSphere();
        // 等待取消
        this.InteractSignal = createSignal<boolean>();

        await Promise.all([this.InteractSignal.Promise]);

        // 销毁小球
        this.EntitySpawn.DestroyAllChild();
        this.InteractSignal = null;
    }
}
