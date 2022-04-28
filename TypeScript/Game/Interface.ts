/* eslint-disable spellcheck/spell-checker */
import { Actor, Character, Class, PlayerController, World } from 'ue';

import { IActionInfo, IPlayFlow, TActionType } from './Flow/Action';

export interface IFlowComponent {
    InitState: IPlayFlow;
}

export type TComponentsState = Record<string, Record<string, unknown>>;

export function parseComponentsState(json: string): TComponentsState {
    if (!json) {
        return {};
    }
    return JSON.parse(json) as TComponentsState;
}

export interface ITsEntityData {
    Guid: string;
    ComponentsStateJson: TComponentsState;
}

export interface ITsEntity extends Actor {
    Guid: string;
    ComponentsStateJson: string;
    Entity: Entity;
    Name: string;
    Interact: (player: ITsPlayer) => Promise<void>;
    GetClass: () => Class;
    GetComponentClasses: () => TComponentClass[];
    Init: (context: IGameContext) => void;
    Start: () => void;
    Destroy: () => void;
}

export type TEntityPureData = ITsEntityData & Record<string, unknown>;

export interface ITsTrigger {
    MaxTriggerTimes: number;
    TriggerActionsJson: string;
}

export interface ITsPlayer extends Character {
    Name: string;
}

export interface IEntityState {
    PrefabId: number;
    Pos: number[];
    Rotation?: number[];
    Scale?: number[];
    PureData: TEntityPureData;
    State?: Record<string, unknown>;
}

export interface IPlayerState {
    Pos: number[];
    Rotation?: number[];
}

export interface IEntityMananger {
    SpawnEntity: (state: IEntityState) => ITsEntity;
    RemoveEntity: (...entities: ITsEntity[]) => void;
    Load: () => void;
    Save: () => void;
}

export interface IGlobalActionsRunner {
    ContainsAction: (actionType: TActionType) => boolean;
    ExecuteOne: (action: IActionInfo) => Promise<void>;
}

export interface ITickable {
    Name: string;
    Tick: (deltaTime: number) => void;
}

export interface ITickManager {
    AddTick: (tickable: ITickable) => void;
    RemoveTick: (tickable: ITickable) => void;
}

export interface IGameContext {
    Player: ITsPlayer;
    PlayerController: PlayerController;
    World: World;
    EntityManager: IEntityMananger;
    TickManager: ITickManager;
    GlobalActionsRunner: IGlobalActionsRunner;
}

export abstract class Component {
    public Entity: Entity;

    public Context: IGameContext;

    public get Name(): string {
        return this.Entity.Name;
    }

    public OnInit(): void {}

    public OnLoad(): void {}

    public OnStart(): void {}

    public OnDestroy(): void {}
}

export type TComponentClass = new () => Component;

type TClass<T> = new (...args: unknown[]) => T;

export class Entity {
    protected MyComponents: Component[] = [];

    public readonly Name: string;

    public readonly Context: IGameContext;

    public constructor(name: string, context: IGameContext) {
        this.Name = name;
        this.Context = context;
    }

    public get Components(): Component[] {
        return this.MyComponents;
    }

    public AddComponent(component: Component): void {
        this.MyComponents.push(component);
        component.Entity = this;
        component.Context = this.Context;
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
        throw new Error(`Component ${classObj.name} not found on Entity ${this.constructor.name}`);
    }

    public TryGetComponent<T extends Component>(classObj: TClass<T>): T {
        for (const component of this.MyComponents) {
            if (component instanceof classObj) {
                return component;
            }
        }
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
            c.OnInit();
        });
    }

    public Load(): void {
        this.Components.forEach((c) => {
            c.OnLoad();
        });
    }

    public Start(): void {
        this.Components.forEach((c) => {
            c.OnStart();
        });
    }

    public Destroy(): void {
        this.Components.forEach((c) => {
            c.OnDestroy();
        });
    }
}
