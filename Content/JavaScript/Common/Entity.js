"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = exports.Component = void 0;
const Log_1 = require("./Log");
class Component {
    Entity;
    get Name() {
        return this.Entity.Name;
    }
    OnInit() { }
    OnStart() { }
    OnDestroy() { }
}
exports.Component = Component;
class Entity {
    MyComponents = [];
    Name;
    constructor(name) {
        this.Name = name;
    }
    get Components() {
        return this.MyComponents;
    }
    AddComponent(component) {
        this.MyComponents.push(component);
        component.Entity = this;
    }
    AddComponentC(classObj) {
        const component = new classObj();
        this.AddComponent(component);
        return component;
    }
    GetComponent(classObj) {
        for (const component of this.MyComponents) {
            if (component instanceof classObj) {
                return component;
            }
        }
        (0, Log_1.error)(`Component ${classObj.name} not found on Entity ${this.constructor.name}`);
        return undefined;
    }
    TryGetComponent(classObj) {
        for (const component of this.MyComponents) {
            if (component instanceof classObj) {
                return component;
            }
        }
        return undefined;
    }
    RemoveComponent(classObj) {
        for (let i = this.MyComponents.length - 1; i >= 0; i--) {
            const component = this.MyComponents[i];
            if (component instanceof classObj) {
                component.Entity = null;
                this.MyComponents.splice(i, 1);
                break;
            }
        }
    }
    HasComponent(classObj) {
        for (const component of this.MyComponents) {
            if (component instanceof classObj) {
                return true;
            }
        }
        return false;
    }
    Init() {
        this.Components.forEach((c) => {
            if (c.OnStart) {
                c.OnInit();
            }
        });
    }
    Start() {
        this.Components.forEach((c) => {
            if (c.OnStart) {
                c.OnStart();
            }
        });
    }
    Destroy() {
        this.Components.forEach((c) => {
            if (c.OnDestroy) {
                c.OnDestroy();
            }
        });
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map