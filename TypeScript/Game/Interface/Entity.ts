/* eslint-disable spellcheck/spell-checker */
import { Actor, Class } from 'ue';

import { TActionType } from './Action';
import { baseActions, getActionsByComponentType, TComponentType } from './Component';

export type TEntityType =
    | 'AiNpc'
    | 'CharacterEntity'
    | 'Entity'
    | 'Lamp'
    | 'Npc'
    | 'RefreshEntity'
    | 'RefreshSingle'
    | 'Rotator'
    | 'SphereActor'
    | 'SphereFactory'
    | 'Spring'
    | 'SpringBoard'
    | 'StateEntity'
    | 'Switcher'
    | 'Trample'
    | 'Trigger'
    | 'Underground';

export const entityConfig: { [key in TEntityType]: TComponentType[] } = {
    AiNpc: [
        'StateComponent',
        'FlowComponent',
        'BehaviorFlowComponent',
        'TalkComponent',
        'MoveComponent',
        'NpcComponent',
        'EntitySpawnerComponent',
    ],
    CharacterEntity: [],
    Entity: [],
    Lamp: ['LampComponent', 'EventComponent', 'StateComponent'],
    Npc: [
        'StateComponent',
        'FlowComponent',
        'BehaviorFlowComponent',
        'TalkComponent',
        'NpcComponent',
        'EntitySpawnerComponent',
    ],
    RefreshSingle: ['RefreshSingleComponent', 'StateComponent', 'EntitySpawnerComponent'],
    RefreshEntity: ['RefreshEntityComponent', 'StateComponent'],
    Rotator: ['RotatorComponent', 'StateComponent', 'EventComponent'],
    SphereActor: ['SphereComponent', 'GrabComponent'],
    SphereFactory: [
        'SphereFactoryComponent',
        'EntitySpawnerComponent',
        'EventComponent',
        'StateComponent',
    ],
    Spring: ['SpringComponent'],
    SpringBoard: ['SpringBoardComponent', 'StateComponent', 'SimpleComponent'],
    StateEntity: [
        'StateComponent',
        'ActorStateComponent',
        'CalculateComponent',
        'EntitySpawnerComponent',
    ],
    Switcher: [
        'StateComponent',
        'ActorStateComponent',
        'SwitcherComponent',
        'EntitySpawnerComponent',
    ],
    Trample: ['TrampleComponent', 'SimpleComponent', 'StateComponent'],
    Trigger: ['StateComponent', 'TriggerComponent', 'EntitySpawnerComponent'],
    Underground: ['UndergroundComponent', 'StateComponent', 'EventComponent'],
};

export function getComponentsTypeByEntityType(entity: TEntityType): TComponentType[] {
    return entityConfig[entity];
}

const actionsByEntity: Map<TEntityType, TActionType[]> = new Map();

export function getActionsByEntityType(entity: TEntityType): TActionType[] {
    let result = actionsByEntity.get(entity);
    if (!result) {
        const actions: TActionType[] = [...baseActions];
        entityConfig[entity].forEach((componentType) => {
            actions.push(...getActionsByComponentType(componentType));
        });
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        actions.sort();
        actionsByEntity.set(entity, actions);
        result = actions;
    }

    return result;
}

// 注意: 由于序列化中会用到Entity的Id,故而新增类型不能改变已有id
export enum EBlueprintId {
    Entity = 0,
    Npc = 1,
    Trigger = 2,
    Player = 3,
    TsSphereActor = 4,
    CharacterEntity = 5,
    AiNpc = 6,
    Spring = 7,
    Rotator = 8,
    Trample = 9,
    StateEntity = 10,
    SphereFactory = 11,
    Underground = 12,
    Lamp = 13,
    // Maze = 14,
    Switcher = 15,
    SpringBoard = 16,
    RefreshSingle = 17,
    RefreshEntity = 18,

    // ExtendedEntity
    AiNpcGuard1 = 1001,
    AiNpcGuard2 = 1002,
    AiNpcAj = 1003,
    AiNpcMother = 1004,
    AiNpcVillageHead = 1005,
    AiNpcVillage1 = 1006,
    AiNpcVillage2 = 1007,
    Gate = 1008,
    SteeringWheel = 1009,
    Switcher1 = 1010,
    Screen = 1011,
    AiNpcTrainer = 1012,
    Invisible = 1013,
    Trash = 1014,
    Mineral = 1015,
    RefreshManage = 1016,

    // Component
    ActorStateComponent = 10001,
}

interface IBlueprintRecord {
    Id: EBlueprintId;
    ClassObj: Class;
    EntityType: TEntityType;
}

const blueprintById: Map<EBlueprintId, IBlueprintRecord> = new Map();
const blueprintByClass: Map<Class, IBlueprintRecord> = new Map();

function registerBlueprint(id: EBlueprintId, classPath: string, entityType: TEntityType): void {
    const classObj = Class.Load(classPath);
    if (!classObj) {
        throw new Error(`No class found for path [${classPath}]`);
    }

    const record: IBlueprintRecord = {
        Id: id,
        ClassObj: classObj,
        EntityType: entityType,
    };

    blueprintById.set(id, record);
    blueprintByClass.set(classObj, record);
}

export function getEntityTypeByBlueprintId(id: EBlueprintId): TEntityType | undefined {
    const record = blueprintById.get(id);
    return record ? record.EntityType : undefined;
}

export function getEntityTypeByClass(classObj: Class): TEntityType | undefined {
    const record = blueprintByClass.get(classObj);
    return record ? record.EntityType : undefined;
}

export function getBlueprintIdByClass(classObj: Class): number | undefined {
    const record = blueprintByClass.get(classObj);
    return record ? record.Id : undefined;
}

export function getEntityTypeByActor(actor: Actor): TEntityType | undefined {
    return getEntityTypeByClass(actor.GetClass());
}

export function getClassByBluprintId(id: EBlueprintId): Class | undefined {
    const record = blueprintById.get(id);
    return record ? record.ClassObj : undefined;
}

function makeTsClassPath(basePath: string, name: string, dir?: string): string {
    if (dir) {
        return `${basePath}${dir}/${name}.${name}_C`;
    }
    return `${basePath}${name}.${name}_C`;
}

const ENTITY_BASE_PATH = '/Game/Blueprints/TypeScript/Game/Entity/';
const classByEntityType: Map<TEntityType, Class> = new Map();
function registerBaseBlueprint(id: EBlueprintId, name: string, entityType: TEntityType): void {
    registerBlueprint(id, makeTsClassPath(ENTITY_BASE_PATH, name), entityType);
    const classObj = getClassByBluprintId(id);
    classByEntityType.set(entityType, classObj);
}

export function getClassByEntityType(entityType: TEntityType): Class {
    return classByEntityType.get(entityType);
}

const ENTITY_EXTENDED_PATH = '/Game/Blueprints/ExtendedEntity/';
function registerExtendedBlueprint(id: EBlueprintId, name: string, entityType: TEntityType): void {
    registerBlueprint(id, makeTsClassPath(ENTITY_EXTENDED_PATH, name), entityType);
}

const b = EBlueprintId;

registerBaseBlueprint(b.Entity, 'TsEntity', 'Entity');
registerBaseBlueprint(b.CharacterEntity, 'TsCharacterEntity', 'CharacterEntity');
registerBaseBlueprint(b.Npc, 'TsNpc', 'Npc');
registerBaseBlueprint(b.Trigger, 'TsTrigger', 'Trigger');
registerBaseBlueprint(b.TsSphereActor, 'TsSphereActor', 'SphereActor');
registerBaseBlueprint(b.AiNpc, 'TsAiNpc', 'AiNpc');
registerBaseBlueprint(b.Spring, 'TsSpring', 'Spring');
registerBaseBlueprint(b.Rotator, 'TsRotator', 'Rotator');
registerBaseBlueprint(b.Trample, 'TsTrample', 'Trample');
registerBaseBlueprint(b.StateEntity, 'TsStateEntity', 'StateEntity');
registerBaseBlueprint(b.SphereFactory, 'TsSphereFactory', 'SphereFactory');
registerBaseBlueprint(b.Underground, 'TsUnderground', 'Underground');
registerBaseBlueprint(b.Lamp, 'TsLamp', 'Lamp');
registerBaseBlueprint(b.Switcher, 'TsSwitcher', 'Switcher');
registerBaseBlueprint(b.SpringBoard, 'TsSpringBoard', 'SpringBoard');
registerBaseBlueprint(b.RefreshSingle, 'TsRefreshSingle', 'RefreshSingle');
registerBaseBlueprint(b.RefreshEntity, 'TsRefreshEntity', 'RefreshEntity');

registerExtendedBlueprint(b.AiNpcGuard1, 'BP_AiNpcGuard1', 'AiNpc');
registerExtendedBlueprint(b.AiNpcGuard2, 'BP_AiNpcGuard2', 'AiNpc');
registerExtendedBlueprint(b.AiNpcAj, 'BP_AiNpcAj', 'AiNpc');
registerExtendedBlueprint(b.AiNpcMother, 'BP_AiNpcMother', 'AiNpc');
registerExtendedBlueprint(b.AiNpcVillageHead, 'BP_AiNpcVillageHead', 'AiNpc');
registerExtendedBlueprint(b.AiNpcVillage1, 'BP_AiNpcVillage1', 'AiNpc');
registerExtendedBlueprint(b.AiNpcVillage2, 'BP_AiNpcVillage2', 'AiNpc');
registerExtendedBlueprint(b.Gate, 'BP_Gate', 'StateEntity');
registerExtendedBlueprint(b.SteeringWheel, 'BP_SteeringWheel', 'Rotator');
registerExtendedBlueprint(b.Switcher1, 'BP_Switcher1', 'Switcher');
registerExtendedBlueprint(b.Screen, 'BP_Screen', 'StateEntity');
registerExtendedBlueprint(b.AiNpcTrainer, 'BP_AiNpcTrainer', 'AiNpc');
registerExtendedBlueprint(b.Invisible, 'BP_Invisible', 'StateEntity');
registerExtendedBlueprint(b.Trash, 'BP_Trash', 'Switcher');
registerExtendedBlueprint(b.Mineral, 'BP_Mineral', 'RefreshSingle');
registerExtendedBlueprint(b.RefreshManage, 'BP_RefreshManage', 'RefreshEntity');
