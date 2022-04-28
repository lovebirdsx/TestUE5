/* eslint-disable spellcheck/spell-checker */
import { EFileRoot, MyFileHelper } from 'ue';

import { error } from '../../Common/Log';
import { TsEntity } from '../Entity/Public';
import { IEntityMananger, IEntityState, IGameContext, ITsEntity } from '../Interface';
import { entitySerializer } from '../Serialize/EntitySerializer';
import { ILevelState, LevelSerializer } from '../Serialize/LevelSerializer';
import { IManager } from './Interface';

export const LEVEL_SAVE_PATH = MyFileHelper.GetPath(EFileRoot.Content, 'Demo/Map.json');
export const STATE_SAVE_PATH = MyFileHelper.GetPath(EFileRoot.Save, 'Demo.json');

export class EntityManager implements IManager, IEntityMananger {
    private readonly LevelSerializer: LevelSerializer = new LevelSerializer();

    private readonly EntityMap = new Map<string, TsEntity>();

    private readonly Entities: TsEntity[] = [];

    private readonly EntitiesToSpawn: TsEntity[] = [];

    private readonly EntitiesToDestroy: TsEntity[] = [];

    private Context: IGameContext;

    public Init(context: IGameContext): void {
        this.Context = context;

        let levelState: ILevelState = undefined;
        if (MyFileHelper.Exist(STATE_SAVE_PATH)) {
            levelState = this.LevelSerializer.Load(STATE_SAVE_PATH);
        } else {
            levelState = this.LevelSerializer.Load(LEVEL_SAVE_PATH);
        }

        if (levelState.Player) {
            entitySerializer.ApplyPlayerState(this.Context.Player, levelState.Player);
        }

        levelState.Entities.forEach((es) => {
            this.SpawnEntity(es);
        });
    }

    public SpawnEntity(state: IEntityState): ITsEntity {
        const entity = entitySerializer.SpawnEntityByState(this.Context, state);
        this.EntitiesToSpawn.push(entity);
        return entity;
    }

    public Exit(): void {
        this.Save();
        this.RemoveEntity(...this.Entities);
    }

    public Tick(deltaTime: number): void {
        if (this.EntitiesToDestroy.length > 0) {
            const entities: TsEntity[] = [];

            this.EntitiesToDestroy.forEach((entity) => {
                const index = this.Entities.indexOf(entity);
                if (index >= 0) {
                    this.Entities.splice(index, 1);
                    this.EntityMap.delete(entity.Guid);
                    entities.push(entity);
                } else {
                    error(`Remove no exist entity ${entity.Name}`);
                }
            });

            entities.forEach((entity) => {
                entity.Destroy();
            });

            entities.forEach((entity) => {
                entity.K2_DestroyActor();
            });
        }

        if (this.EntitiesToSpawn.length > 0) {
            const entities = this.EntitiesToSpawn.splice(0, this.EntitiesToSpawn.length);
            this.Entities.push(...entities);

            entities.forEach((entity) => {
                this.EntityMap.set(entity.Guid, entity);
            });

            entities.forEach((entity) => {
                entity.Start();
            });
        }
    }

    public Save(): void {
        this.LevelSerializer.Save(this.Entities, this.Context.Player, STATE_SAVE_PATH);
    }

    public RemoveEntity(...entities: ITsEntity[]): void {
        this.EntitiesToDestroy.push(...(entities as TsEntity[]));
    }

    public Load(): void {
        this.RemoveEntity(...this.Entities);
        this.Init(this.Context);
    }
}
