/* eslint-disable spellcheck/spell-checker */
import { Actor, Class } from 'ue';

import { TActionType } from './Action';
import { baseActions, getActionsByComponentType, TComponentType } from './Component';
import { EBlueprint } from './EntityPb';

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
    BpEntity = 0,
    BpNpc = 1,
    BpTrigger = 2,
    BpPlayer = 3,
    BpTsSphereActor = 4,
    BpCharacterEntity = 5,
    BpAiNpc = 6,
    BpSpring = 7,
    BpRotator = 8,
    BpTrample = 9,
    BpStateEntity = 10,
    BpSphereFactory = 11,
    BpUnderground = 12,
    BpLamp = 13,
    // Maze = 14,
    BpSwitcher = 15,
    BpSpringBoard = 16,
    BpRefreshSingle = 17,
    BpRefreshEntity = 18,

    // ExtendedEntity
    BpAiNpcGuard1 = 1001,
    BpAiNpcGuard2 = 1002,
    BpAiNpcAj = 1003,
    BpAiNpcMother = 1004,
    BpAiNpcVillageHead = 1005,
    BpAiNpcVillage1 = 1006,
    BpAiNpcVillage2 = 1007,
    BpGate = 1008,
    BpSteeringWheel = 1009,
    BpSwitcher1 = 1010,
    BpScreen = 1011,
    BpAiNpcTrainer = 1012,
    BpInvisible = 1013,
    BpTrash = 1014,
    BpMineral = 1015,
    BpRefreshManage = 1016,
}

export type TBlueprintType = keyof typeof EBlueprint;

interface IBlueprintRecord {
    Type: TBlueprintType;
    ClassObj: Class;
    EntityType: TEntityType;
}

const blueprintByType: Map<TBlueprintType, IBlueprintRecord> = new Map();
const blueprintByClass: Map<Class, IBlueprintRecord> = new Map();

function registerBlueprint(type: TBlueprintType, classPath: string, entityType: TEntityType): void {
    const classObj = Class.Load(classPath);
    if (!classObj) {
        throw new Error(`No class found for path [${classPath}]`);
    }

    const record: IBlueprintRecord = {
        Type: type,
        ClassObj: classObj,
        EntityType: entityType,
    };

    blueprintByType.set(type, record);
    blueprintByClass.set(classObj, record);
}

export function getEntityTypeByBlueprintId(id: TBlueprintType): TEntityType | undefined {
    const record = blueprintByType.get(id);
    return record ? record.EntityType : undefined;
}

export function getEntityTypeByClass(classObj: Class): TEntityType | undefined {
    const record = blueprintByClass.get(classObj);
    return record ? record.EntityType : undefined;
}

export function getBlueprintTypeByClass(classObj: Class): TBlueprintType | undefined {
    const record = blueprintByClass.get(classObj);
    return record ? record.Type : undefined;
}

export function getEntityTypeByActor(actor: Actor): TEntityType | undefined {
    return getEntityTypeByClass(actor.GetClass());
}

export function getClassByBluprintType(type: TBlueprintType): Class | undefined {
    const record = blueprintByType.get(type);
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
function registerBaseBlueprint(type: TBlueprintType, name: string, entityType: TEntityType): void {
    registerBlueprint(type, makeTsClassPath(ENTITY_BASE_PATH, name), entityType);
    const classObj = getClassByBluprintType(type);
    classByEntityType.set(entityType, classObj);
}

export function getClassByEntityType(entityType: TEntityType): Class {
    return classByEntityType.get(entityType);
}

const ENTITY_EXTENDED_PATH = '/Game/Blueprints/ExtendedEntity/';
function registerExtendedBlueprint(
    type: TBlueprintType,
    name: string,
    entityType: TEntityType,
): void {
    registerBlueprint(type, makeTsClassPath(ENTITY_EXTENDED_PATH, name), entityType);
}

registerBaseBlueprint('BpEntity', 'TsEntity', 'Entity');
registerBaseBlueprint('BpCharacterEntity', 'TsCharacterEntity', 'CharacterEntity');
registerBaseBlueprint('BpNpc', 'TsNpc', 'Npc');
registerBaseBlueprint('BpTrigger', 'TsTrigger', 'Trigger');
registerBaseBlueprint('BpTsSphereActor', 'TsSphereActor', 'SphereActor');
registerBaseBlueprint('BpAiNpc', 'TsAiNpc', 'AiNpc');
registerBaseBlueprint('BpSpring', 'TsSpring', 'Spring');
registerBaseBlueprint('BpRotator', 'TsRotator', 'Rotator');
registerBaseBlueprint('BpTrample', 'TsTrample', 'Trample');
registerBaseBlueprint('BpStateEntity', 'TsStateEntity', 'StateEntity');
registerBaseBlueprint('BpSphereFactory', 'TsSphereFactory', 'SphereFactory');
registerBaseBlueprint('BpUnderground', 'TsUnderground', 'Underground');
registerBaseBlueprint('BpLamp', 'TsLamp', 'Lamp');
registerBaseBlueprint('BpSwitcher', 'TsSwitcher', 'Switcher');
registerBaseBlueprint('BpSpringBoard', 'TsSpringBoard', 'SpringBoard');
registerBaseBlueprint('BpRefreshSingle', 'TsRefreshSingle', 'RefreshSingle');
registerBaseBlueprint('BpRefreshEntity', 'TsRefreshEntity', 'RefreshEntity');

registerExtendedBlueprint('BpAiNpcGuard1', 'BP_AiNpcGuard1', 'AiNpc');
registerExtendedBlueprint('BpAiNpcGuard2', 'BP_AiNpcGuard2', 'AiNpc');
registerExtendedBlueprint('BpAiNpcAj', 'BP_AiNpcAj', 'AiNpc');
registerExtendedBlueprint('BpAiNpcMother', 'BP_AiNpcMother', 'AiNpc');
registerExtendedBlueprint('BpAiNpcVillageHead', 'BP_AiNpcVillageHead', 'AiNpc');
registerExtendedBlueprint('BpAiNpcVillage1', 'BP_AiNpcVillage1', 'AiNpc');
registerExtendedBlueprint('BpAiNpcVillage2', 'BP_AiNpcVillage2', 'AiNpc');
registerExtendedBlueprint('BpGate', 'BP_Gate', 'StateEntity');
registerExtendedBlueprint('BpSteeringWheel', 'BP_SteeringWheel', 'Rotator');
registerExtendedBlueprint('BpSwitcher1', 'BP_Switcher1', 'Switcher');
registerExtendedBlueprint('BpScreen', 'BP_Screen', 'StateEntity');
registerExtendedBlueprint('BpAiNpcTrainer', 'BP_AiNpcTrainer', 'AiNpc');
registerExtendedBlueprint('BpInvisible', 'BP_Invisible', 'StateEntity');
registerExtendedBlueprint('BpTrash', 'BP_Trash', 'Switcher');
registerExtendedBlueprint('BpMineral', 'BP_Mineral', 'RefreshSingle');
registerExtendedBlueprint('BpRefreshManage', 'BP_RefreshManage', 'RefreshEntity');

export * from './EntityPb';
