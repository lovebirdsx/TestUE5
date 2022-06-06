/* eslint-disable spellcheck/spell-checker */
import { Actor, GameModeBase, PlayerController, Transform, World } from 'ue';

import { getTsClassByUeClass } from '../Common/Class';
import { ITransform } from '../Common/Interface';
import { Event, parse } from '../Common/Util';
import { IActionInfo, IInteract, TActionType } from './Interface/Action';
import { IInteractiveComponent } from './Interface/Component';
import { TweenManager } from './Manager/TweenManager';

export type TComponentData = Record<string, unknown> & {
    Disabled: boolean;
};

export type TComponentsData = Record<string, TComponentData>;

export function parseComponentsData(json: string): TComponentsData {
    if (!json) {
        return {};
    }
    return parse(json, true) as TComponentsData;
}

export interface IEntityData {
    Id: number;
    Name?: string;
    BlueprintId: number;
    Transform?: ITransform;
    ComponentsData: TComponentsData;
}

export interface ITsEntity extends Actor {
    Id: number;
    ComponentsDataJson: string;
    Entity: Entity;
    GetComponentClasses: () => TComponentClass[];
    Init: () => void;
    LoadState: () => void;
    Start: () => void;
    Destroy: () => void;
}

export function getEntityName(entity: ITsEntity): string {
    const classObj = getTsClassByUeClass(entity.GetClass());
    return classObj.name;
}

export interface ITsTrigger {
    MaxTriggerTimes: number;
    TriggerActionsJson: string;
}

export type TEntityState = Record<string, unknown>;

export interface ISavedEntityState extends TEntityState {
    Id: number;
    Deleted: boolean;
    DelayActions?: IActionInfo[];
}

export type TDestroyType = 'delete' | 'deleteByRefresh' | 'streaming';
export type TSpawnType = 'streaming' | 'user';

export interface IEntityMananger {
    EntityAdded: Event<ITsEntity>;
    EntityRemoved: Event<number>;
    EntityRegistered: Event<ITsEntity>;
    EntityDeregistered: Event<ITsEntity>;
    RegisterEntity: (entity: ITsEntity) => boolean;
    UnregisterEntity: (entity: ITsEntity) => boolean;
    SpawnEntity: (data: IEntityData, transform: Transform) => ITsEntity;
    RemoveEntity: (entity: ITsEntity, destroyType: TDestroyType) => void;
    GetDestoryType: (id: number) => TDestroyType;
    GetSpawnType: (id: number) => TSpawnType;
    GetEntity: (id: number) => ITsEntity;
    GetAllEntites: () => ITsEntity[];
}

export interface ILevelDataManager {
    GetEntityData: (id: number) => IEntityData;
    GenEntityData: (templateId: number, entityId?: number) => IEntityData;
}

export interface IStateManager {
    GetState: (id: number) => ISavedEntityState;
    SetState: (id: number, state: TEntityState) => void;
    PushDelayAction: (id: number, actionInfo: IActionInfo) => void;
    DeleteState: (id: number) => void;
    MarkDelete: (id: number) => void;
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

export interface ITimeCall {
    Name: string;
    CallTime: number;
    TimeCall: () => void;
}

export interface ITickManager {
    AddTick: (tickable: ITickable) => void;
    RemoveTick: (tickable: ITickable) => void;
    AddDelayCall: (call: () => void) => void;
    HasTick: (tickable: ITickable) => boolean;
    AddTimeCall: (timeCall: ITimeCall) => void;
    RemoveTimeCall: (timeCall: ITimeCall) => void;
    HasTimeCall: (timeCall: ITimeCall) => boolean;
}

export interface IGameController {
    SaveGame: () => void;
}

export interface IGameContext {
    Player: ITsEntity;
    PlayerController: PlayerController;
    GameMode: GameModeBase;
    World: World;
    EntityManager: IEntityMananger;
    LevelDataManager: ILevelDataManager;
    TickManager: ITickManager;
    GlobalActionsRunner: IGlobalActionsRunner;
    StateManager: IStateManager;
    GameController: IGameController;
    TweenManager: TweenManager;
}

export const gameContext: IGameContext = {
    GameController: undefined,
    Player: undefined,
    PlayerController: undefined,
    GameMode: undefined,
    World: undefined,
    EntityManager: undefined,
    LevelDataManager: undefined,
    TickManager: undefined,
    GlobalActionsRunner: undefined,
    StateManager: undefined,
    TweenManager: undefined,
};

export abstract class Component {
    public Entity: Entity;

    public get Name(): string {
        return this.Entity.Name;
    }

    public get IsValid(): boolean {
        return this.Entity.IsValid;
    }

    public OnInit(): void {}

    public OnLoadState(): void {}

    public OnStart(): void {}

    public OnDestroy(): void {}

    public OnTriggerEnter?(other: Entity): void;

    public OnTriggerExit?(other: Entity): void;
}

export type TComponentClass = new () => Component;

type TClass<T> = new (...args: unknown[]) => T;

export class Entity {
    protected MyComponents: Component[] = [];

    public readonly Name: string;

    public readonly Actor: Actor;

    public readonly Id: number;

    public IsValid = true;

    private readonly TriggerEnterComponents: Component[] = [];

    private readonly TriggerExitComponents: Component[] = [];

    public constructor(name: string, id: number, actor: Actor) {
        this.Name = name;
        this.Id = id;
        this.Actor = actor;
    }

    public get Components(): Component[] {
        return this.MyComponents;
    }

    public AddComponent(component: Component): void {
        this.MyComponents.push(component);
        component.Entity = this;
        this.AccessOptionalCallback(component, true);
    }

    private AccessOptionalCallback(component: Component, isAdd: boolean): void {
        if (component.OnTriggerEnter) {
            if (isAdd) {
                this.TriggerEnterComponents.push(component);
            } else {
                this.TriggerEnterComponents.splice(this.TriggerEnterComponents.indexOf(component));
            }
        }
        if (component.OnTriggerExit) {
            if (isAdd) {
                this.TriggerExitComponents.push(component);
            } else {
                this.TriggerExitComponents.splice(this.TriggerExitComponents.indexOf(component));
            }
        }
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
        throw new Error(`Component ${classObj.name} not found on Entity ${this.Name}`);
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
                this.AccessOptionalCallback(component, false);
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

    public LoadState(): void {
        this.Components.forEach((c) => {
            c.OnLoadState();
        });
    }

    public Start(): void {
        if (!this.IsValid) {
            return;
        }
        this.Components.forEach((c) => {
            c.OnStart();
        });
    }

    public Destroy(): void {
        this.IsValid = false;
        this.Components.forEach((c) => {
            c.OnDestroy();
        });
    }

    public OnTriggerEnter(other: Entity): void {
        this.TriggerEnterComponents.forEach((component) => {
            component.OnTriggerEnter(other);
        });
    }

    public OnTriggerExit(other: Entity): void {
        this.TriggerExitComponents.forEach((component) => {
            component.OnTriggerExit(other);
        });
    }
}

export interface IInteractCall {
    Name: string;
    CallBack: (action: IInteract) => void;
}

export class InteractiveComponent extends Component implements IInteractiveComponent {
    public Content: string;

    public Icon: string;

    private readonly DefalutIcon = '';

    // eslint-disable-next-line @typescript-eslint/require-await
    public async Interact(entity: Entity): Promise<void> {
        throw new Error('Interact is not implement');
    }

    public GetInteractContent(): string {
        return this.Content ? this.Content : this.Name;
    }

    public GetInteractIcon(): string {
        return this.Icon ? this.Icon : this.DefalutIcon;
    }
}

export const DEFUALT_NUMBER_EDIT_TEXT_WIDTH = 40;
export const DEFUALT_VALUE_NAME_TEXT_WIDTH = 40;
