"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentRegistry = void 0;
const Log_1 = require("../../../Common/Log");
class ComponentRegistry {
    ClassMap = new Map();
    SchemeMap = new Map();
    RegisterClass(classObj, scheme) {
        this.ClassMap.set(classObj.name, classObj);
        this.SchemeMap.set(classObj.name, scheme);
    }
    Spawn(type) {
        const classObj = this.ClassMap.get(type);
        if (!classObj) {
            (0, Log_1.error)(`No component class for [${type}]`);
            return undefined;
        }
        return new classObj();
    }
    GetScheme(type) {
        const scheme = this.SchemeMap.get(type);
        if (!scheme) {
            (0, Log_1.error)(`No scheme for component [${type}]`);
            return undefined;
        }
        return scheme;
    }
}
exports.componentRegistry = new ComponentRegistry();
//# sourceMappingURL=ComponentRegistry.js.map