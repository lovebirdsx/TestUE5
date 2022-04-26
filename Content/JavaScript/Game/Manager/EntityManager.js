"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
const EntitySerializer_1 = require("../Serialize/EntitySerializer");
const LevelSerializer_1 = require("../Serialize/LevelSerializer");
class EntityManager {
    LevelSerializer = new LevelSerializer_1.LevelSerializer();
    EntityMap = new Map();
    Entities = [];
    Init() {
        const levelState = this.LevelSerializer.Load();
        if (levelState.Player) {
            // todo
        }
        levelState.Entities.forEach((es) => {
            const entity = EntitySerializer_1.entitySerializer.SpawnEntityByState(es);
            this.EntityMap.set(entity.Guid, entity);
            this.Entities.push(entity);
        });
    }
    Exit() {
        //
    }
    Update() {
        //
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=EntityManager.js.map