/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Transform } from 'ue';

import { IEntityData } from '../../UniverseEditor/Common/Interface/IEntity';
import { error, log } from '../../UniverseEditor/Common/Misc/Log';
import { Event } from '../../UniverseEditor/Common/Misc/Util';
import { gameContext, IEntityMananger, ITsEntity, TDestroyType, TSpawnType } from '../Interface';
import { entitySerializer } from '../Serialize/EntitySerializer';
import { IManager } from './Interface';

export class EntityManager implements IManager, IEntityMananger {
    public readonly EntityAdded = new Event<ITsEntity>('EntityAdded');

    public readonly EntityRemoved = new Event<number>('EntityRemoved');

    public readonly EntityRegistered = new Event<ITsEntity>('EntityRegistered');

    public readonly EntityDeregistered = new Event<ITsEntity>('EntityDeregistered');

    private readonly EntityMap = new Map<number, ITsEntity>();

    private readonly Entities: ITsEntity[] = [];

    private readonly EntitiesToSpawn: ITsEntity[] = [];

    private readonly EntitiesToDestroy: ITsEntity[] = [];

    private readonly DestroyRecord = new Map<number, TDestroyType>();

    private readonly SpawnRecord = new Map<number, TSpawnType>();

    public constructor() {
        gameContext.EntityManager = this;
    }

    public Init(): void {}

    public GetEntity(id: number): ITsEntity {
        return this.EntityMap.get(id);
    }

    public GetAllEntites(): ITsEntity[] {
        return this.Entities;
    }

    public SpawnEntity(
        data: IEntityData,
        transform: Transform,
        spawnType: TSpawnType = 'user',
    ): ITsEntity {
        const entity = entitySerializer.SpawnEntityByData(data, transform);
        this.EntitiesToSpawn.push(entity);
        this.SpawnRecord.set(entity.Id, spawnType);
        log(`Spawn entity ${entity.Entity.Name}} [${entity.Id}]`);
        return entity;
    }

    public RemoveEntity(entity: ITsEntity, destroyType: TDestroyType): void {
        this.DestroyRecord.set(entity.Id, destroyType);
        this.EntitiesToDestroy.push(entity);
        log(`Remove entity ${entity.Entity.Name} [${entity.Id}]`);
    }

    public GetDestoryType(id: number): TDestroyType {
        // EntityManager????????????, ???????????????Unreal?????????????????????
        return this.DestroyRecord.get(id) || 'streaming';
    }

    public GetSpawnType(id: number): TSpawnType {
        return this.SpawnRecord.get(id) || 'streaming';
    }

    public RegisterEntity(entity: ITsEntity): boolean {
        const exist = this.EntityMap.get(entity.Id);
        if (exist) {
            throw new Error(
                `Duplicate entity guid exist[${exist.GetName()}] add[${entity.GetActorLabel()}] id[${
                    entity.Id
                }]`,
            );
        }
        this.Entities.push(entity);
        this.EntityMap.set(entity.Id, entity);
        this.EntityRegistered.Invoke(entity);
        return true;
    }

    public UnregisterEntity(entity: ITsEntity): boolean {
        const index = this.Entities.indexOf(entity);
        if (index >= 0) {
            this.Entities.splice(index, 1);
            this.EntityMap.delete(entity.Id);
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
                // ????????????????????????????????????, ?????????????????????????????????
                // ???????????????????????????, ??????????????????
                if (entity.Entity.IsValid) {
                    const id = entity.Id;
                    entity.K2_DestroyActor();
                    this.EntityRemoved.Invoke(id);

                    // ?????????????????????EntityRemove?????????, ?????????????????????????????????
                    this.DestroyRecord.delete(id);
                    this.SpawnRecord.delete(id);
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
