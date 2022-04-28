"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Async_1 = require("../../Common/Async");
const Log_1 = require("../../Common/Log");
const Config_1 = require("../Common/Config");
const LevelUtil_1 = require("../Common/LevelUtil");
const EntitySerializer_1 = require("../Serialize/EntitySerializer");
const LevelSerializer_1 = require("../Serialize/LevelSerializer");
class EntityManager {
    LevelSerializer = new LevelSerializer_1.LevelSerializer();
    EntityMap = new Map();
    Entities = [];
    EntitiesToSpawn = [];
    EntitiesToDestroy = [];
    Context;
    Init(context) {
        this.Context = context;
        const levelSettings = context.World.K2_GetWorldSettings();
        if (levelSettings.DisableCustomEntityLoad) {
            this.InitAllExistEntites();
        }
        else {
            this.RemoveAllExistEntites();
            this.LoadState();
        }
    }
    RemoveAllExistEntites() {
        const entities = LevelUtil_1.LevelUtil.GetAllEntities(this.Context.World);
        entities.forEach((entity) => {
            entity.K2_DestroyActor();
        });
    }
    InitAllExistEntites() {
        const entities = LevelUtil_1.LevelUtil.GetAllEntities(this.Context.World);
        entities.forEach((entity) => {
            entity.Init(this.Context);
            entity.Load();
        });
        this.EntitiesToSpawn.push(...entities);
    }
    LoadState() {
        let levelState = undefined;
        const mapSavePath = Config_1.gameConfig.GetCurrentMapSavePath(this.Context.World);
        if (ue_1.MyFileHelper.Exist(mapSavePath)) {
            levelState = this.LevelSerializer.Load(mapSavePath);
        }
        else {
            const mapDataPath = Config_1.gameConfig.GetCurrentMapDataPath(this.Context.World);
            levelState = this.LevelSerializer.Load(mapDataPath);
        }
        if (levelState.Player) {
            EntitySerializer_1.entitySerializer.ApplyPlayerState(this.Context.Player, levelState.Player);
        }
        levelState.Entities.forEach((es) => {
            this.SpawnEntity(es);
        });
    }
    SpawnEntity(state) {
        const entity = EntitySerializer_1.entitySerializer.SpawnEntityByState(this.Context, state);
        this.EntitiesToSpawn.push(entity);
        return entity;
    }
    Exit() {
        this.Save();
        this.RemoveEntity(...this.Entities);
    }
    Tick(deltaTime) {
        if (this.EntitiesToDestroy.length > 0) {
            const entities = [];
            this.EntitiesToDestroy.forEach((entity) => {
                const index = this.Entities.indexOf(entity);
                if (index >= 0) {
                    this.Entities.splice(index, 1);
                    this.EntityMap.delete(entity.Guid);
                    entities.push(entity);
                }
                else {
                    (0, Log_1.error)(`Remove no exist entity ${entity.Name}`);
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
                    throw new Error(`Duplicate entity guid exist[${exist.Name}] add[${entity.Guid}] guid[${entity.Guid}]`);
                }
                this.Entities.push(entity);
                this.EntityMap.set(entity.Guid, entity);
            });
            entities.forEach((entity) => {
                entity.Start();
            });
        }
    }
    Save() {
        const mapSavePath = Config_1.gameConfig.GetCurrentMapSavePath(this.Context.World);
        this.LevelSerializer.Save(this.Entities, this.Context.Player, mapSavePath);
    }
    RemoveEntity(...entities) {
        this.EntitiesToDestroy.push(...entities);
    }
    async LoadSync() {
        this.RemoveEntity(...this.Entities);
        await (0, Async_1.delay)(0.1);
        this.LoadState();
    }
    Load() {
        void this.LoadSync();
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map