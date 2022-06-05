/* eslint-disable spellcheck/spell-checker */
import { Actor, Class } from 'ue';

import { TActionType } from './Action';
import { baseActions, getActionsByComponentType, TComponentType } from './Component';

export type TEntityType =
    | 'AiNpc'
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

export function getComponentsTypeByEntity(entity: TEntityType): TComponentType[] {
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

const ENTITY_BASE_PATH = '/Game/Blueprints/TypeScript/Game/Entity/';

function makeTsClassPath(basePath: string, name: string, dir?: string): string {
    if (dir) {
        return `${basePath}${dir}/${name}.${name}_C`;
    }
    return `${basePath}${name}.${name}_C`;
}

function makeBaseEntityPath(name: string): string {
    return makeTsClassPath(ENTITY_BASE_PATH, name);
}

const b = EBlueprintId;

registerBlueprint(b.Npc, makeBaseEntityPath('TsNpc'), 'Npc');
registerBlueprint(b.Trigger, makeBaseEntityPath('TsTrigger'), 'Trigger');
registerBlueprint(b.TsSphereActor, makeBaseEntityPath('TsSphereActor'), 'SphereActor');
registerBlueprint(b.AiNpc, makeBaseEntityPath('TsAiNpc'), 'AiNpc');
registerBlueprint(b.Spring, makeBaseEntityPath('TsSpring'), 'Spring');
registerBlueprint(b.Rotator, makeBaseEntityPath('TsRotator'), 'Rotator');
registerBlueprint(b.Trample, makeBaseEntityPath('TsTrample'), 'Trample');
registerBlueprint(b.StateEntity, makeBaseEntityPath('TsStateEntity'), 'StateEntity');
registerBlueprint(b.SphereFactory, makeBaseEntityPath('TsSphereFactory'), 'SphereFactory');
registerBlueprint(b.Underground, makeBaseEntityPath('TsUnderground'), 'Underground');
registerBlueprint(b.Lamp, makeBaseEntityPath('TsLamp'), 'Lamp');
registerBlueprint(b.Switcher, makeBaseEntityPath('TsSwitcher'), 'Switcher');
registerBlueprint(b.SpringBoard, makeBaseEntityPath('TsSpringBoard'), 'SpringBoard');
registerBlueprint(b.RefreshSingle, makeBaseEntityPath('TsRefreshSingle'), 'RefreshSingle');
registerBlueprint(b.RefreshEntity, makeBaseEntityPath('TsRefreshEntity'), 'RefreshEntity');

const ENTITY_EXTENDED_PATH = '/Game/Blueprints/ExtendedEntity/';
function makeExtendEntityPath(name: string): string {
    return makeTsClassPath(ENTITY_EXTENDED_PATH, name);
}

registerBlueprint(b.AiNpcGuard1, makeExtendEntityPath('BP_AiNpcGuard1'), 'AiNpc');
registerBlueprint(b.AiNpcGuard2, makeExtendEntityPath('BP_AiNpcGuard2'), 'AiNpc');
registerBlueprint(b.AiNpcAj, makeExtendEntityPath('BP_AiNpcAj'), 'AiNpc');
registerBlueprint(b.AiNpcMother, makeExtendEntityPath('BP_AiNpcMother'), 'AiNpc');
registerBlueprint(b.AiNpcVillageHead, makeExtendEntityPath('BP_AiNpcVillageHead'), 'AiNpc');
registerBlueprint(b.AiNpcVillage1, makeExtendEntityPath('BP_AiNpcVillage1'), 'AiNpc');
registerBlueprint(b.AiNpcVillage2, makeExtendEntityPath('BP_AiNpcVillage2'), 'AiNpc');
registerBlueprint(b.Gate, makeExtendEntityPath('BP_Gate'), 'StateEntity');
registerBlueprint(b.SteeringWheel, makeExtendEntityPath('BP_SteeringWheel'), 'Rotator');
registerBlueprint(b.Switcher1, makeExtendEntityPath('BP_Switcher1'), 'Switcher');
registerBlueprint(b.Screen, makeExtendEntityPath('BP_Screen'), 'StateEntity');
registerBlueprint(b.AiNpcTrainer, makeExtendEntityPath('BP_AiNpcTrainer'), 'AiNpc');
registerBlueprint(b.Invisible, makeExtendEntityPath('BP_Invisible'), 'StateEntity');
registerBlueprint(b.Trash, makeExtendEntityPath('BP_Trash'), 'Switcher');
registerBlueprint(b.Mineral, makeExtendEntityPath('BP_Mineral'), 'RefreshSingle');
// registerBlueprint(b.RefreshManage, makeExtendEntityPath('BP_RefreshManage'), 'RefreshEntity');

export function getEntityTypeByBlueprintId(id: EBlueprintId): TEntityType | undefined {
    const record = blueprintById.get(id);
    return record ? record.EntityType : undefined;
}

export function getEntityTypeByClass(classObj: Class): TEntityType | undefined {
    const record = blueprintByClass.get(classObj);
    return record ? record.EntityType : undefined;
}

export function getEntityTypeByActor(actor: Actor): TEntityType | undefined {
    return getEntityTypeByClass(actor.GetClass());
}

export function getClassByBluprintId(id: EBlueprintId): Class | undefined {
    const record = blueprintById.get(id);
    return record ? record.ClassObj : undefined;
}
