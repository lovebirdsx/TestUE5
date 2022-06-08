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
export type TBlueprintType =
    // eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
    | 'Entity'
    | 'Npc'
    | 'Trigger'
    | 'Player'
    | 'TsSphereActor'
    | 'CharacterEntity'
    | 'AiNpc'
    | 'Spring'
    | 'Rotator'
    | 'Trample'
    | 'StateEntity'
    | 'SphereFactory'
    | 'Underground'
    | 'Lamp'
    | 'Switcher'
    | 'SpringBoard'
    | 'RefreshSingle'
    | 'RefreshEntity'

    // ExtendedEntity
    | 'AiNpcGuard1'
    | 'AiNpcGuard2'
    | 'AiNpcAj'
    | 'AiNpcMother'
    | 'AiNpcVillageHead'
    | 'AiNpcVillage1'
    | 'AiNpcVillage2'
    | 'Gate'
    | 'SteeringWheel'
    | 'Switcher1'
    | 'Screen'
    | 'AiNpcTrainer'
    | 'Invisible'
    | 'Trash'
    | 'Mineral'
    | 'RefreshManage';

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

registerBaseBlueprint('Entity', 'TsEntity', 'Entity');
registerBaseBlueprint('CharacterEntity', 'TsCharacterEntity', 'CharacterEntity');
registerBaseBlueprint('Npc', 'TsNpc', 'Npc');
registerBaseBlueprint('Trigger', 'TsTrigger', 'Trigger');
registerBaseBlueprint('TsSphereActor', 'TsSphereActor', 'SphereActor');
registerBaseBlueprint('AiNpc', 'TsAiNpc', 'AiNpc');
registerBaseBlueprint('Spring', 'TsSpring', 'Spring');
registerBaseBlueprint('Rotator', 'TsRotator', 'Rotator');
registerBaseBlueprint('Trample', 'TsTrample', 'Trample');
registerBaseBlueprint('StateEntity', 'TsStateEntity', 'StateEntity');
registerBaseBlueprint('SphereFactory', 'TsSphereFactory', 'SphereFactory');
registerBaseBlueprint('Underground', 'TsUnderground', 'Underground');
registerBaseBlueprint('Lamp', 'TsLamp', 'Lamp');
registerBaseBlueprint('Switcher', 'TsSwitcher', 'Switcher');
registerBaseBlueprint('SpringBoard', 'TsSpringBoard', 'SpringBoard');
registerBaseBlueprint('RefreshSingle', 'TsRefreshSingle', 'RefreshSingle');
registerBaseBlueprint('RefreshEntity', 'TsRefreshEntity', 'RefreshEntity');

registerExtendedBlueprint('AiNpcGuard1', 'BP_AiNpcGuard1', 'AiNpc');
registerExtendedBlueprint('AiNpcGuard2', 'BP_AiNpcGuard2', 'AiNpc');
registerExtendedBlueprint('AiNpcAj', 'BP_AiNpcAj', 'AiNpc');
registerExtendedBlueprint('AiNpcMother', 'BP_AiNpcMother', 'AiNpc');
registerExtendedBlueprint('AiNpcVillageHead', 'BP_AiNpcVillageHead', 'AiNpc');
registerExtendedBlueprint('AiNpcVillage1', 'BP_AiNpcVillage1', 'AiNpc');
registerExtendedBlueprint('AiNpcVillage2', 'BP_AiNpcVillage2', 'AiNpc');
registerExtendedBlueprint('Gate', 'BP_Gate', 'StateEntity');
registerExtendedBlueprint('SteeringWheel', 'BP_SteeringWheel', 'Rotator');
registerExtendedBlueprint('Switcher1', 'BP_Switcher1', 'Switcher');
registerExtendedBlueprint('Screen', 'BP_Screen', 'StateEntity');
registerExtendedBlueprint('AiNpcTrainer', 'BP_AiNpcTrainer', 'AiNpc');
registerExtendedBlueprint('Invisible', 'BP_Invisible', 'StateEntity');
registerExtendedBlueprint('Trash', 'BP_Trash', 'Switcher');
registerExtendedBlueprint('Mineral', 'BP_Mineral', 'RefreshSingle');
registerExtendedBlueprint('RefreshManage', 'BP_RefreshManage', 'RefreshEntity');

export * from './EntityPb';
