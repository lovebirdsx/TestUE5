"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
const EntitySerializer_1 = require("../Serialize/EntitySerializer");
const LevelSerializer_1 = require("../Serialize/LevelSerializer");
class EntityManager {
    LevelSerializer = new LevelSerializer_1.LevelSerializer();
    EntityMap = new Map();
    Entities = [];
    EntitiesToSpawn = [];
    EntitiesToDestroy = [];
    Init(world) {
        const levelState = this.LevelSerializer.Load();
        if (levelState.Player) {
            // todo
        }
        levelState.Entities.forEach((es) => {
            const entity = EntitySerializer_1.entitySerializer.SpawnEntityByState(world, es);
            this.EntityMap.set(entity.Guid, entity);
            this.Entities.push(entity);
            this.EntitiesToSpawn.push(entity);
        });
    }
    Exit() {
        //
    }
    Tick(deltaTime) {
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
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map