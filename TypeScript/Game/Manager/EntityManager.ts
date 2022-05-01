/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, DemoWorldSettings, MyFileHelper, Pawn } from 'ue';

import { delay } from '../../Common/Async';
import { error } from '../../Common/Log';
import { gameConfig } from '../Common/Config';
import { LevelUtil } from '../Common/LevelUtil';
import { isPlayer } from '../Entity/EntityRegistry';
import { gameContext, IEntityMananger, IEntityState, ITsEntity } from '../Interface';
import { entitySerializer } from '../Serialize/EntitySerializer';
import { ILevelState, LevelSerializer } from '../Serialize/LevelSerializer';
import { IManager } from './Interface';

export class EntityManager implements IManager, IEntityMananger {
    private readonly LevelSerializer: LevelSerializer = new LevelSerializer();

    private readonly EntityMap = new Map<string, ITsEntity>();

    private readonly Entities: ITsEntity[] = [];

    private readonly EntitiesToSpawn: ITsEntity[] = [];

    private readonly EntitiesToDestroy: ITsEntity[] = [];

    public constructor() {
        gameContext.EntityManager = this;
    }

    public Init(): void {
        const levelSettings = gameContext.World.K2_GetWorldSettings() as DemoWorldSettings;
        if (!levelSettings.DisableCustomEntityLoad) {
            this.RemoveAllExistEntites();
            this.LoadState();
        }
    }

    public GetEntity(guid: string): ITsEntity {
        return this.EntityMap.get(guid);
    }

    private RemoveAllExistEntites(): void {
        const entities = LevelUtil.GetAllEntities(gameContext.World);
        entities.forEach((entity) => {
            entity.K2_DestroyActor();
        });
    }

    private LoadLevel(): [boolean, ILevelState] {
        let levelState: ILevelState = undefined;
        const mapSavePath = gameConfig.GetCurrentMapSavePath(gameContext.World);
        let isFirstLoad = false;
        if (MyFileHelper.Exist(mapSavePath)) {
            levelState = this.LevelSerializer.Load(mapSavePath);
        } else {
            const mapDataPath = gameConfig.GetCurrentMapDataPath(gameContext.World);
            levelState = this.LevelSerializer.Load(mapDataPath);
            isFirstLoad = true;
        }
        return [isFirstLoad, levelState];
    }

    private LoadState(): void {
        const [isFirstLoad, levelState] = this.LoadLevel();

        if (isFirstLoad) {
            this.SpawnPlayer();
        }

        levelState.Entities.forEach((es) => {
            this.SpawnEntity(es);
        });
    }

    private SpawnPlayer(): ITsEntity {
        if (gameContext.Player) {
            throw new Error(`Player can only spawn by EntityManager`);
        }

        const player = entitySerializer.SpawnDefaultPlayer();
        this.EntitiesToSpawn.push(player);

        return player;
    }

    public SpawnEntity(state: IEntityState): ITsEntity {
        const entity = entitySerializer.SpawnEntityByState(state);
        this.EntitiesToSpawn.push(entity);
        return entity;
    }

    public Exit(): void {
        this.Save();
        this.RemoveEntity(...this.Entities);
    }

    public Tick(deltaTime: number): void {
        if (this.EntitiesToDestroy.length > 0) {
            const entities: ITsEntity[] = [];

            this.EntitiesToDestroy.forEach((entity) => {
                const index = this.Entities.indexOf(entity);
                if (index >= 0) {
                    this.Entities.splice(index, 1);
                    this.EntityMap.delete(entity.Guid);
                    entities.push(entity);
                } else {
                    error(`Remove no exist entity ${entity.GetName()}`);
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
                        `Duplicate entity guid exist[${exist.GetName()}] add[${entity.Guid}] guid[${
                            entity.Guid
                        }]`,
                    );
                }
                this.Entities.push(entity);
                this.EntityMap.set(entity.Guid, entity);
            });

            entities.forEach((entity) => {
                if (isPlayer(entity)) {
                    gameContext.PlayerController.Possess(entity as Actor as Pawn);
                }
                entity.Start();
            });
        }
    }

    public Save(): void {
        const mapSavePath = gameConfig.GetCurrentMapSavePath(gameContext.World);
        this.LevelSerializer.Save(this.Entities, mapSavePath);
    }

    public RemoveEntity(...entities: ITsEntity[]): void {
        this.EntitiesToDestroy.push(...entities);
    }

    private async LoadSync(): Promise<void> {
        this.RemoveEntity(...this.Entities);
        await delay(0.1);
        this.LoadState();
    }

    public Load(): void {
        void this.LoadSync();
    }
}
