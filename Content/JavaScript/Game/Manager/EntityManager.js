"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = exports.STATE_SAVE_PATH = exports.LEVEL_SAVE_PATH = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
const EntitySerializer_1 = require("../Serialize/EntitySerializer");
const LevelSerializer_1 = require("../Serialize/LevelSerializer");
exports.LEVEL_SAVE_PATH = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, 'Demo/Map.json');
exports.STATE_SAVE_PATH = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, 'Demo.json');
class EntityManager {
    LevelSerializer = new LevelSerializer_1.LevelSerializer();
    EntityMap = new Map();
    Entities = [];
    EntitiesToSpawn = [];
    EntitiesToDestroy = [];
    Context;
    Init(context) {
        this.Context = context;
        let levelState = undefined;
        if (ue_1.MyFileHelper.Exist(exports.STATE_SAVE_PATH)) {
            levelState = this.LevelSerializer.Load(exports.STATE_SAVE_PATH);
        }
        else {
            levelState = this.LevelSerializer.Load(exports.LEVEL_SAVE_PATH);
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
    Save() {
        this.LevelSerializer.Save(this.Entities, this.Context.Player, exports.STATE_SAVE_PATH);
    }
    RemoveEntity(...entities) {
        this.EntitiesToDestroy.push(...entities);
    }
    Load() {
        this.RemoveEntity(...this.Entities);
        this.Init(this.Context);
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map