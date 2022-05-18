/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Transform } from 'ue';

import { error, log } from '../../Common/Log';
import { Event } from '../../Common/Util';
import { gameContext, IEntityData, IEntityMananger, ITsEntity } from '../Interface';
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

    public RemoveEntity(entity: ITsEntity): void {
        this.EntitiesToDestroy.push(entity);
        log(`Remove entity ${entity.Entity.Name} [${entity.Guid}]`);
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

    public Exit(): void {
        this.Entities.forEach((entity) => {
            this.RemoveEntity(entity);
        });
    }

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
                }
            });
        }

        if (this.EntitiesToSpawn.length > 0) {
            const entities = this.EntitiesToSpawn.splice(0);
            entities.forEach((entity) => {
                this.EntityAdded.Invoke(entity);
            });
        }
    }
}
