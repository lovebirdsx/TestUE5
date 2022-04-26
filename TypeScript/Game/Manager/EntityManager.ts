/* eslint-disable spellcheck/spell-checker */
import TsEntity from '../Entity/TsEntity';
import { entitySerializer } from '../Serialize/EntitySerializer';
import { LevelSerializer } from '../Serialize/LevelSerializer';
import { IManager } from './Interface';

export class EntityManager implements IManager {
    private readonly LevelSerializer: LevelSerializer = new LevelSerializer();

    private readonly EntityMap = new Map<string, TsEntity>();

    private readonly Entities: TsEntity[] = [];

    public Init(): void {
        const levelState = this.LevelSerializer.Load();
        if (levelState.Player) {
            // todo
        }

        levelState.Entities.forEach((es) => {
            const entity = entitySerializer.SpawnEntityByState(es);
            this.EntityMap.set(entity.Guid, entity);
            this.Entities.push(entity);
        });
    }

    public Exit(): void {
        //
    }

    public Update(): void {
        //
    }
}
