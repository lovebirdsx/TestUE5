"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
const EntitySerializer_1 = require("../Serialize/EntitySerializer");
const LevelSerializer_1 = require("../Serialize/LevelSerializer");
class EntityManager {
    LevelSerializer = new LevelSerializer_1.LevelSerializer();
    EntityMap = new Map();
    Entities = [];
    Init(world) {
        const levelState = this.LevelSerializer.Load();
        if (levelState.Player) {
            // todo
        }
        levelState.Entities.forEach((es) => {
            const entity = EntitySerializer_1.entitySerializer.SpawnEntityByState(world, es);
            this.EntityMap.set(entity.Guid, entity);
            this.Entities.push(entity);
        });
    }
    Exit() {
        //
    }
    Tick(deltaTime) {
        //
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map