/* eslint-disable spellcheck/spell-checker */
import { ITransform, toTransform } from '../../Common/Interface';
import { EntityTemplateOp } from '../Common/Operations/EntityTemplate';
import { ISpawn } from '../Flow/Action';
import { Component, Entity, gameContext, ITsEntity } from '../Interface';
import { StateComponent } from './StateComponent';

interface IEntitySpawnRecord {
    TemplateGuid: string;
    EntityGuid: string;
    Transform: ITransform;
}

export interface ICallBack {
    Name: string;
    CallBack: (guid: string) => void;
}

export class EntitySpawnerComponent extends Component {
    private State: StateComponent;

    private SpawnRecord: IEntitySpawnRecord[] = [];

    private readonly Children: Map<string, ITsEntity> = new Map();

    private readonly Destroycall = new Set<ICallBack>();

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);

        gameContext.EntityManager.EntityRemoved.AddCallback(this.OnEntityRemoved);
    }

    public OnDestroy(): void {
        // 销毁的时候, 自动移除构造的子Entity
        // 但子Entity的记录还在, 下次流送的时候依然能够恢复
        this.Children.forEach((child) => {
            gameContext.EntityManager.RemoveEntity(child);
        });

        gameContext.EntityManager.EntityRemoved.RemoveCallBack(this.OnEntityRemoved);
    }

    private readonly OnEntityRemoved = (guid: string): void => {
        if (!this.Children.has(guid)) {
            return;
        }

        this.Children.delete(guid);
        this.SpawnRecord.splice(
            this.SpawnRecord.findIndex((record) => record.EntityGuid === guid),
            1,
        );

        if (this.SpawnRecord.length <= 0) {
            this.State.SetState('SpawnRecord', undefined);
        }

        this.Destroycall.forEach((call) => {
            call.CallBack(guid);
        });
    };

    private SpawnChild(
        templateGuid: string,
        transform: ITransform,
        entityGuid?: string,
    ): ITsEntity {
        const entityData = EntityTemplateOp.GenEntityData(templateGuid, entityGuid);
        const entity = gameContext.EntityManager.SpawnEntity(entityData, toTransform(transform));
        this.Children.set(entity.Guid, entity);
        return entity;
    }

    public OnLoadState(): void {
        this.SpawnRecord = this.State.GetState('SpawnRecord') || [];

        this.SpawnRecord.forEach((record) => {
            this.SpawnChild(record.TemplateGuid, record.Transform, record.EntityGuid);
        });
    }

    public Spawn(action: ISpawn): void {
        const entity = this.SpawnChild(action.TemplateGuid, action.Transform);
        this.SpawnRecord.push({
            TemplateGuid: action.TemplateGuid,
            Transform: action.Transform,
            EntityGuid: entity.Guid,
        });
        this.State.SetState('SpawnRecord', this.SpawnRecord);
    }

    public DestroyAllChild(): void {
        this.Children.forEach((child) => {
            gameContext.EntityManager.RemoveEntity(child);
        });

        this.Children.clear();
        this.SpawnRecord.splice(0);
        this.State.SetState('SpawnRecord', undefined);
    }

    public Destroy(): void {
        gameContext.EntityManager.RemoveEntity(this.Entity.Actor as ITsEntity);
        this.DestroyAllChild();
    }

    public FindChild(entity: Entity): string {
        let result = '';
        this.Children.forEach((tsEntity) => {
            if (tsEntity.Entity.Actor.ActorGuid === entity.Actor.ActorGuid) {
                result = tsEntity.Guid;
            }
        });
        return result;
    }

    public RegistryDestroy(call: ICallBack): void {
        if (this.Destroycall.has(call)) {
            throw new Error(`Add duplicate tick ${call.Name}`);
        }
        this.Destroycall.add(call);
    }
}
