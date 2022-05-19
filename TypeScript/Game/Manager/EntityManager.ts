/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Transform } from 'ue';

import { error, log } from '../../Common/Log';
import { Event } from '../../Common/Util';
import {
    gameContext,
    IEntityData,
    IEntityMananger,
    ITsEntity,
    TDestroyType,
    TSpawnType,
} from '../Interface';
import { entitySerializer } from '../Serialize/EntitySerializer';
import { IManager } from './Interface';

export class EntityManager implements IManager, IEntityMananger {
    public readonly EntityAdded = new Event<ITsEntity>('EntityAdded');

    public readonly EntityRemoved = new Event<string>('EntityRemoved');

    public readonly EntityRegistered = new Event<ITsEntity>('EntityRegistered');

    public readonly EntityDeregistered = new Event<ITsEntity>('EntityDeregistered');

    private readonly EntityMap = new Map<string, ITsEntity>();

    private readonly Entities: ITsEntity[] = [];

    private readonly EntitiesToSpawn: ITsEntity[] = [];

    private readonly EntitiesToDestroy: ITsEntity[] = [];

    private readonly DestroyRecord = new Map<string, TDestroyType>();

    private readonly GuidsBySpawn = new Set<string>();

    public constructor() {
        gameContext.EntityManager = this;
    }

    public Init(): void {}

    public GetEntity(guid: string): ITsEntity {
        return this.EntityMap.get(guid);
    }

    public GetAllEntites(): ITsEntity[] {
        return this.Entities;
    }

    public SpawnEntity(data: IEntityData, transform: Transform): ITsEntity {
        const entity = entitySerializer.SpawnEntityByData(data, transform);
        this.EntitiesToSpawn.push(entity);
        log(`Spawn entity ${entity.Entity.Name}} [${entity.Guid}]`);
        return entity;
    }

    public RemoveEntity(entity: ITsEntity, destroyType: TDestroyType): void {
        this.DestroyRecord.set(entity.Guid, destroyType);
        this.EntitiesToDestroy.push(entity);
        log(`Remove entity ${entity.Entity.Name} [${entity.Guid}]`);
    }

    public GetDestoryType(guid: string): TDestroyType {
        // EntityManager没有记录, 则认为是被Unreal的流送给销毁了
        return this.DestroyRecord.get(guid) || 'streaming';
    }

    public GetSpawnType(guid: string): TSpawnType {
        return this.GuidsBySpawn.has(guid) ? 'user' : 'streaming';
    }

    public RegisterEntity(entity: ITsEntity): boolean {
        const exist = this.EntityMap.get(entity.Guid);
        if (exist) {
            throw new Error(
                `Duplicate entity guid exist[${exist.GetName()}] add[${entity.Guid}] guid[${
                    entity.Guid
                }]`,
            );
        }
        this.Entities.push(entity);
        this.EntityMap.set(entity.Guid, entity);
        this.EntityRegistered.Invoke(entity);
        return true;
    }

    public UnregisterEntity(entity: ITsEntity): boolean {
        const index = this.Entities.indexOf(entity);
        if (index >= 0) {
            this.Entities.splice(index, 1);
            this.EntityMap.delete(entity.Guid);
            this.EntityDeregistered.Invoke(entity);
            return true;
        }

        error(`Remove no exist entity ${entity.GetName()}`);
        return false;
    }

    public Exit(): void {}

    public Tick(deltaTime: number): void {
        if (this.EntitiesToDestroy.length > 0) {
            const entities = this.EntitiesToDestroy.splice(0);

            entities.forEach((entity) => {
                // 由于移除操作是带有延迟的, 所以有可能出现重复移除
                // 所以在此处加入判断, 避免重复移除
                if (entity.Entity.IsValid) {
                    const guid = entity.Guid;
                    entity.K2_DestroyActor();
                    this.EntityRemoved.Invoke(guid);

                    // 等外部处理完成EntityRemove的消息, 则可以移除销毁的记录了
                    this.DestroyRecord.delete(guid);
                    this.GuidsBySpawn.delete(guid);
                }
            });
        }

        if (this.EntitiesToSpawn.length > 0) {
            const entities = this.EntitiesToSpawn.splice(0);
            entities.forEach((entity) => {
                this.GuidsBySpawn.add(entity.Guid);
                this.EntityAdded.Invoke(entity);
            });
        }
    }
}
