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

    public Init(world: World): void {
        const levelState = this.LevelSerializer.Load();
        if (levelState.Player) {
            // todo
        }

        levelState.Entities.forEach((es) => {
            const entity = entitySerializer.SpawnEntityByState(world, es);
            this.EntityMap.set(entity.Guid, entity);
            this.Entities.push(entity);
        });
    }

    public Exit(): void {
        //
    }

    public Tick(deltaTime: number): void {
        //
    }
}
