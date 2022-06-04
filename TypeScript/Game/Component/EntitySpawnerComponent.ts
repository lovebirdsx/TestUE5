/* eslint-disable spellcheck/spell-checker */
import { ITransform, toTransform } from '../../Common/Interface';
import { EntityTemplateOp } from '../Common/Operations/EntityTemplate';
import { Component, gameContext, ITsEntity } from '../Interface';
import { ISpawn } from '../Interface/Action';
import { StateComponent } from './StateComponent';

interface IEntitySpawnRecord {
    TemplateGuid: string;
    EntityId: number;
    Transform: ITransform;
}

export class EntitySpawnerComponent extends Component {
    private State: StateComponent;

    private SpawnRecord: IEntitySpawnRecord[] = [];

    private readonly Children: Map<number, ITsEntity> = new Map();

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);

        gameContext.EntityManager.EntityRemoved.AddCallback(this.OnEntityRemoved);
    }

    public OnLoadState(): void {
        this.SpawnRecord = this.State.GetState('SpawnRecord') || [];

        this.SpawnRecord.forEach((record) => {
            this.SpawnChild(record.TemplateGuid, record.Transform, record.EntityId);
        });
    }

    public OnDestroy(): void {
        // 销毁的时候, 自动移除构造的子Entity
        // 但子Entity的记录还在, 下次流送的时候依然能够恢复
        this.Children.forEach((child) => {
            gameContext.EntityManager.RemoveEntity(child, 'streaming');
        });

        gameContext.EntityManager.EntityRemoved.RemoveCallBack(this.OnEntityRemoved);
    }

    private readonly OnEntityRemoved = (id: number): void => {
        if (!this.Children.has(id)) {
            return;
        }

        this.Children.delete(id);
        this.SpawnRecord.splice(
            this.SpawnRecord.findIndex((record) => record.EntityId === id),
            1,
        );

        if (this.SpawnRecord.length <= 0) {
            this.State.SetState('SpawnRecord', undefined);
        }
    };

    public SpawnChild(templateGuid: string, transform: ITransform, entityId?: number): ITsEntity {
        const entityData = EntityTemplateOp.GenEntityData(templateGuid, entityId);
        const entity = gameContext.EntityManager.SpawnEntity(entityData, toTransform(transform));
        this.Children.set(entity.Id, entity);
        return entity;
    }

    public Spawn(action: ISpawn): void {
        const entity = this.SpawnChild(action.TemplateGuid, action.Transform);
        this.SpawnRecord.push({
            TemplateGuid: action.TemplateGuid,
            Transform: action.Transform,
            EntityId: entity.Id,
        });
        this.State.SetState('SpawnRecord', this.SpawnRecord);
    }

    public DestroyAllChild(): void {
        this.Children.forEach((child) => {
            gameContext.EntityManager.RemoveEntity(child, 'delete');
        });

        this.Children.clear();
        this.SpawnRecord.splice(0);
        this.State.SetState('SpawnRecord', undefined);
    }

    public Destroy(): void {
        gameContext.EntityManager.RemoveEntity(this.Entity.Actor as ITsEntity, 'delete');
        this.DestroyAllChild();
    }

    public HasChild(id: number): boolean {
        return this.Children.has(id);
    }

    public GetChild(id: number): ITsEntity {
        return this.Children.get(id);
    }

    public GetChildNum(): number {
        return this.Children.size;
    }
}
