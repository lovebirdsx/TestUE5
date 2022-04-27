/* eslint-disable spellcheck/spell-checker */
import { World } from 'ue';

import { TsEntity } from '../Entity/Public';
import { entitySerializer } from '../Serialize/EntitySerializer';
import { LevelSerializer } from '../Serialize/LevelSerializer';
import { IManager } from './Interface';

export class EntityManager implements IManager {
    private readonly LevelSerializer: LevelSerializer = new LevelSerializer();

    private readonly EntityMap = new Map<string, TsEntity>();

    private readonly Entities: TsEntity[] = [];

    private readonly EntitiesToSpawn: TsEntity[] = [];

    private readonly EntitiesToDestroy: TsEntity[] = [];

    public Init(world: World): void {
        const levelState = this.LevelSerializer.Load();
        if (levelState.Player) {
            // todo
        }

        levelState.Entities.forEach((es) => {
            const entity = entitySerializer.SpawnEntityByState(world, es);
            this.EntityMap.set(entity.Guid, entity);
            this.Entities.push(entity);

            this.EntitiesToSpawn.push(entity);
        });
    }

    public Exit(): void {
        //
    }

    public Tick(deltaTime: number): void {
        if (this.EntitiesToSpawn.length > 0) {
            const entities = this.EntitiesToSpawn.splice(0, this.EntitiesToSpawn.length);
            entities.forEach((entity) => {
                entity.Init();
            });

            entities.forEach((entity) => {
                entity.Start();
            });
        }

        if (this.EntitiesToDestroy.length > 0) {
            const entities = this.EntitiesToDestroy.splice(0, this.EntitiesToDestroy.length);

            entities.forEach((entity) => {
                entity.Destroy();
            });

            entities.forEach((entity) => {
                entity.K2_DestroyActor();
            });
        }
    }
}
