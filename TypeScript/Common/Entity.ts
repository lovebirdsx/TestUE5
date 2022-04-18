import { error } from './Log';

export abstract class Component {
    public Entity: Entity;

    public get Name(): string {
        return this.Entity.Name;
    }

    public OnInit(): void {}

    public OnStart(): void {}

    public OnDestroy(): void {}
}

export type TComponentClass = new () => Component;

type TClass<T> = new (...args: unknown[]) => T;

export class Entity {
    protected MyComponents: Component[] = [];

    public readonly Name: string;

    public constructor(name: string) {
        this.Name = name;
    }

    public get Components(): Component[] {
        return this.MyComponents;
    }

    public AddComponent(component: Component): void {
        this.MyComponents.push(component);
        component.Entity = this;
    }

    public AddComponentC<T extends Component>(classObj: TClass<T>): T {
        const component = new classObj();
        this.AddComponent(component);
        return component;
    }

    public GetComponent<T extends Component>(classObj: TClass<T>): T {
        for (const component of this.MyComponents) {
            if (component instanceof classObj) {
                return component;
            }
        }
        error(`Component ${classObj.name} not found on Entity ${this.constructor.name}`);
        return undefined;
    }

    public RemoveComponent<T extends Component>(classObj: TClass<T>): void {
        for (let i = this.MyComponents.length - 1; i >= 0; i--) {
            const component = this.MyComponents[i];
            if (component instanceof classObj) {
                component.Entity = null;
                this.MyComponents.splice(i, 1);
                break;
            }
        }
    }

    public HasComponent<T extends Component>(classObj: TClass<T>): boolean {
        for (const component of this.MyComponents) {
            if (component instanceof classObj) {
                return true;
            }
        }

        return false;
    }

    public Init(): void {
        this.Components.forEach((c) => {
            if (c.OnStart) {
                c.OnInit();
            }
        });
    }

    public Start(): void {
        this.Components.forEach((c) => {
            if (c.OnStart) {
                c.OnStart();
            }
        });
    }

    public Destroy(): void {
        this.Components.forEach((c) => {
            if (c.OnDestroy) {
                c.OnDestroy();
            }
        });
    }
}
