"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = exports.Component = exports.parseComponentsState = void 0;
function parseComponentsState(json) {
    if (!json) {
        return {};
    }
    return JSON.parse(json);
}
exports.parseComponentsState = parseComponentsState;
class Component {
    Entity;
    Context;
    get Name() {
        return this.Entity.Name;
    }
    OnInit() { }
    OnLoad() { }
    OnStart() { }
    OnDestroy() { }
}
exports.Component = Component;
class Entity {
    MyComponents = [];
    Name;
    Context;
    constructor(name, context) {
        this.Name = name;
        this.Context = context;
    }
    get Components() {
        return this.MyComponents;
    }
    AddComponent(component) {
        this.MyComponents.push(component);
        component.Entity = this;
        component.Context = this.Context;
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
        throw new Error(`Component ${classObj.name} not found on Entity ${this.constructor.name}`);
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
            c.OnInit();
        });
    }
    Load() {
        this.Components.forEach((c) => {
            c.OnLoad();
        });
    }
    Start() {
        this.Components.forEach((c) => {
            c.OnStart();
        });
    }
    Destroy() {
        this.Components.forEach((c) => {
            c.OnDestroy();
        });
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Interface.js.map