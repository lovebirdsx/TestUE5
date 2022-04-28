/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { MyFileHelper } from 'ue';

import { delay } from '../../Common/Async';
import { error } from '../../Common/Log';
import { gameConfig } from '../Common/Config';
import { TsEntity } from '../Entity/Public';
import { IEntityMananger, IEntityState, IGameContext, ITsEntity } from '../Interface';
import { entitySerializer } from '../Serialize/EntitySerializer';
import { ILevelState, LevelSerializer } from '../Serialize/LevelSerializer';
import { IManager } from './Interface';

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
        const mapSavePath = gameConfig.GetCurrentMapSavePath(context.World);
        if (MyFileHelper.Exist(mapSavePath)) {
            levelState = this.LevelSerializer.Load(mapSavePath);
        } else {
            const mapDataPath = gameConfig.GetCurrentMapDataPath(context.World);
            levelState = this.LevelSerializer.Load(mapDataPath);
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

            this.EntitiesToDestroy.splice(0, this.EntitiesToDestroy.length);

            entities.forEach((entity) => {
                entity.Destroy();
            });

            entities.forEach((entity) => {
                entity.K2_DestroyActor();
            });
        }

        if (this.EntitiesToSpawn.length > 0) {
            const entities = this.EntitiesToSpawn.splice(0, this.EntitiesToSpawn.length);

            entities.forEach((entity) => {
                const exist = this.EntityMap.get(entity.Guid);
                if (exist) {
                    throw new Error(
                        `Duplicate entity guid exist[${exist.Name}] add[${entity.Guid}] guid[${entity.Guid}]`,
                    );
                }
                this.Entities.push(entity);
                this.EntityMap.set(entity.Guid, entity);
            });

            entities.forEach((entity) => {
                entity.Start();
            });
        }
    }

    public Save(): void {
        const mapSavePath = gameConfig.GetCurrentMapSavePath(this.Context.World);
        this.LevelSerializer.Save(this.Entities, this.Context.Player, mapSavePath);
    }

    public RemoveEntity(...entities: ITsEntity[]): void {
        this.EntitiesToDestroy.push(...(entities as TsEntity[]));
    }

    private async LoadSync(): Promise<void> {
        this.RemoveEntity(...this.Entities);
        await delay(0.1);
        this.Init(this.Context);
    }

    public Load(): void {
        void this.LoadSync();
    }
}
