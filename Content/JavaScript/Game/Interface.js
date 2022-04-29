"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genEntity = exports.InteractiveComponent = exports.Entity = exports.Component = exports.parseComponentsState = void 0;
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
    TriggerEnterComponents = [];
    TriggerExitComponents = [];
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
        this.AccessOptionalCallback(component, true);
    }
    AccessOptionalCallback(component, isAdd) {
        if (component.OnTriggerEnter) {
            if (isAdd) {
                this.TriggerEnterComponents.push(component);
            }
            else {
                this.TriggerEnterComponents.splice(this.TriggerEnterComponents.indexOf(component));
            }
        }
        if (component.OnTriggerExit) {
            if (isAdd) {
                this.TriggerExitComponents.push(component);
            }
            else {
                this.TriggerExitComponents.splice(this.TriggerExitComponents.indexOf(component));
            }
        }
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
                this.AccessOptionalCallback(component, false);
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
    OnTriggerEnter(other) {
        this.TriggerEnterComponents.forEach((component) => {
            component.OnTriggerEnter(other);
        });
    }
    OnTriggerExit(other) {
        this.TriggerExitComponents.forEach((component) => {
            component.OnTriggerExit(other);
        });
    }
}
exports.Entity = Entity;
class InteractiveComponent extends Component {
    // eslint-disable-next-line @typescript-eslint/require-await
    async Interact(entity) {
        throw new Error('Interact is not implement');
    }
}
exports.InteractiveComponent = InteractiveComponent;
function genEntity(tsEntity, context) {
    const entity = new Entity(tsEntity.GetName(), context);
    const componentsState = parseComponentsState(tsEntity.ComponentsStateJson);
    const componentClasses = tsEntity.GetComponentClasses();
    componentClasses.forEach((componentClass) => {
        const component = entity.AddComponentC(componentClass);
        const data = componentsState[componentClass.name];
        if (data) {
            Object.assign(component, data);
        }
    });
    return entity;
}
exports.genEntity = genEntity;
//# sourceMappingURL=Interface.js.map