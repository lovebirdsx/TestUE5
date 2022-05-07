/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, MyFileHelper, Pawn } from 'ue';

import { error } from '../../Common/Log';
import { Event } from '../../Common/Util';
import { gameConfig } from '../Common/Config';
import { LevelUtil } from '../Common/LevelUtil';
import { isPlayer } from '../Entity/EntityRegistry';
import { gameContext, IEntityData, IEntityMananger, ITsEntity } from '../Interface';
import { entitySerializer } from '../Serialize/EntitySerializer';
import { ILevelState, LevelSerializer } from '../Serialize/LevelSerializer';
import { IManager } from './Interface';

export class EntityManager implements IManager, IEntityMananger {
    public readonly EntityAdded = new Event<ITsEntity>('EntityAdded');

    public readonly EntityRemoved = new Event<ITsEntity>('EntityRemoved');

    public readonly EntityRegistered = new Event<ITsEntity>('EntityRegistered');

    public readonly EntityDeregistered = new Event<ITsEntity>('EntityDeregistered');

    private readonly LevelSerializer: LevelSerializer = new LevelSerializer();

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

    public SpawnEntity(state: IEntityData): ITsEntity {
        const entity = entitySerializer.SpawnEntityByState(state);
        this.EntitiesToSpawn.push(entity);
        return entity;
    }

    public RegisterEntity(entity: ITsEntity): boolean {
        const exist = this.EntityMap.get(entity.Guid);
        if (exist) {
            error(
                `Duplicate entity guid exist[${exist.GetName()}] add[${entity.Guid}] guid[${
                    entity.Guid
                }]`,
            );
            return false;
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
        this.RemoveEntity(...this.Entities);
    }

    public Tick(deltaTime: number): void {
        if (this.EntitiesToDestroy.length > 0) {
            const entities: ITsEntity[] = [];

            this.EntitiesToDestroy.forEach((entity) => {
                if (this.UnregisterEntity(entity)) {
                    entities.push(entity);
                    this.EntityRemoved.Invoke(entity);
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
                this.RegisterEntity(entity);
                this.EntityAdded.Invoke(entity);
            });

            entities.forEach((entity) => {
                if (isPlayer(entity)) {
                    gameContext.PlayerController.Possess(entity as Actor as Pawn);
                }
                entity.Start();
            });
        }
    }

    public RemoveEntity(...entities: ITsEntity[]): void {
        this.EntitiesToDestroy.push(...entities);
    }
}
