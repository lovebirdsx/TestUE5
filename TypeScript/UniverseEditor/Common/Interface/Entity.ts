/* eslint-disable spellcheck/spell-checker */
import { Actor, Blueprint, Class } from 'ue';

import { csvRegistry } from '../CsvConfig/CsvRegistry';
import { ExtendedEntityCsv } from '../CsvConfig/ExtendedEntityCsv';
import { isUe5 } from '../Init';
import { getProjectPath } from '../Misc/File';
import { log } from '../Misc/Log';
import {
    applyDiff,
    createDiff,
    isChildOfClass,
    isObjChildOfClass,
    readJsonObj,
} from '../Misc/Util';
import { getActionsByComponentType, getBaseActions } from './Component';
import { globalConfig } from './Global';
import { TActionType } from './IAction';
import { TComponentType } from './IComponent';
import {
    IBlueprintConfig,
    IEntityConfig,
    IEntityData,
    IEntityTemplate,
    IEntityTemplateConfig,
    TComponentsByEntity,
    TComponentsData,
    TEntityType,
} from './IEntity';

const componentsByEntityUe5: TComponentsByEntity = {
    Player: [],
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

const componentsByEntityAki: TComponentsByEntity = {};

export const entityConfig: IEntityConfig = {
    ComponentsByEntity: isUe5() ? componentsByEntityUe5 : componentsByEntityAki,
};

export function getComponentsTypeByEntityType(entity: TEntityType): TComponentType[] {
    return entityConfig.ComponentsByEntity[entity] || [];
}

const actionsByEntity: Map<TEntityType, TActionType[]> = new Map();

export function getActionsByEntityType(entity: TEntityType): TActionType[] {
    let result = actionsByEntity.get(entity);
    if (!result) {
        const actions: TActionType[] = [...getBaseActions()];
        const componentsType = getComponentsTypeByEntityType(entity);
        componentsType.forEach((componentType) => {
            actions.push(...getActionsByComponentType(componentType));
        });
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        actions.sort();
        actionsByEntity.set(entity, actions);
        result = actions;
    }

    return result;
}

interface IBlueprintRecord {
    Type: string;
    ClassObj: Class;
    EntityType: TEntityType;
}

const blueprintByType: Map<string, IBlueprintRecord> = new Map();
const blueprintByClass: Map<Class, IBlueprintRecord> = new Map();

function registerBlueprint(type: string, classPath: string, entityType: TEntityType): void {
    const classObj = Class.Load(classPath);
    if (!classObj) {
        throw new Error(`No class found for path [${classPath}]`);
    }

    if (blueprintByType.has(type)) {
        throw new Error(`Duplicate blueprint type [${type}] for class [${classPath}]`);
    }

    const record: IBlueprintRecord = {
        Type: type,
        ClassObj: classObj,
        EntityType: entityType,
    };

    blueprintByType.set(type, record);
    blueprintByClass.set(classObj, record);
}

export function getEntityTypeByBlueprintType(id: string): TEntityType | undefined {
    const record = blueprintByType.get(id);
    return record ? record.EntityType : undefined;
}

export function isBlueprintTypeTheSameEntity(bp1: string, bp2: string): boolean {
    const et1 = getEntityTypeByBlueprintType(bp1);
    const et2 = getEntityTypeByBlueprintType(bp2);
    return et1 !== undefined && et1 === et2;
}

export function getEntityTypeByClass(classObj: Class): TEntityType | undefined {
    const record = blueprintByClass.get(classObj);
    return record ? record.EntityType : undefined;
}

export function getBlueprintTypeByClass(classObj: Class): string | undefined {
    const record = blueprintByClass.get(classObj);
    return record ? record.Type : undefined;
}

export function getBlueprintType(acotr: Actor): string | undefined {
    return getBlueprintTypeByClass(acotr.GetClass());
}

export function getEntityTypeByActor(actor: Actor): TEntityType | undefined {
    return getEntityTypeByClass(actor.GetClass());
}

export function isRegistedEntity(actor: Actor): boolean {
    return getEntityTypeByActor(actor) !== undefined;
}

export function getClassByBluprintType(type: string): Class | undefined {
    const record = blueprintByType.get(type);
    return record ? record.ClassObj : undefined;
}

function makeTsClassPath(basePath: string, name: string, dir?: string): string {
    if (dir) {
        return `${basePath}${dir}/${name}.${name}_C`;
    }
    return `${basePath}${name}.${name}_C`;
}

// 玩家对象
registerBlueprint(
    'Player',
    '/Game/Blueprints/TypeScript/Game/Player/TsPlayer.TsPlayer_C',
    'Player',
);

const ENTITY_BASE_PATH = '/Game/Blueprints/TypeScript/Game/Entity/';
const classByEntityType: Map<TEntityType, Class> = new Map();
function registerBaseBlueprint(entityType: TEntityType, name: string): void {
    registerBlueprint(entityType, makeTsClassPath(ENTITY_BASE_PATH, name), entityType);
    const classObj = getClassByBluprintType(entityType);
    classByEntityType.set(entityType, classObj);
}

export function getClassByEntityType(entityType: TEntityType): Class {
    return classByEntityType.get(entityType);
}

if (isUe5()) {
    registerBaseBlueprint('Entity', 'TsEntity');
    registerBaseBlueprint('CharacterEntity', 'TsCharacterEntity');
    registerBaseBlueprint('Npc', 'TsNpc');
    registerBaseBlueprint('Trigger', 'TsTrigger');
    registerBaseBlueprint('SphereActor', 'TsSphereActor');
    registerBaseBlueprint('AiNpc', 'TsAiNpc');
    registerBaseBlueprint('Spring', 'TsSpring');
    registerBaseBlueprint('Rotator', 'TsRotator');
    registerBaseBlueprint('Trample', 'TsTrample');
    registerBaseBlueprint('StateEntity', 'TsStateEntity');
    registerBaseBlueprint('SphereFactory', 'TsSphereFactory');
    registerBaseBlueprint('Underground', 'TsUnderground');
    registerBaseBlueprint('Lamp', 'TsLamp');
    registerBaseBlueprint('Switcher', 'TsSwitcher');
    registerBaseBlueprint('SpringBoard', 'TsSpringBoard');
    registerBaseBlueprint('RefreshSingle', 'TsRefreshSingle');
    registerBaseBlueprint('RefreshEntity', 'TsRefreshEntity');
}

const extendEntityCsv = csvRegistry.GetCsv(ExtendedEntityCsv);
extendEntityCsv.Rows.forEach((row) => {
    const blueprint = Blueprint.Load(row.Bp);
    if (!blueprint) {
        throw new Error(`Load bp from ${row.Bp} failed`);
    }
    const entityType = getEntityTypeByClass(blueprint.ParentClass);
    registerBlueprint(row.Id, `${row.Bp}_C`, entityType);
    log(`registerBlueprint ${row.Id} ${row.Bp} ${entityType}`);
});

export function loadEntityTemplateConfig(): IEntityTemplateConfig {
    const path = getProjectPath(globalConfig.TemplateConfigPath);
    return readJsonObj(path);
}

const entityClass = getClassByEntityType('Entity');
const characterEntityClass = getClassByEntityType('CharacterEntity');
const playerClass = Class.Load('/Game/Blueprints/TypeScript/Game/Player/TsPlayer.TsPlayer_C');

export function isEntityClassUe5(classObj: Class): boolean {
    return (
        isChildOfClass(classObj, entityClass) ||
        isChildOfClass(classObj, characterEntityClass) ||
        isChildOfClass(classObj, playerClass)
    );
}

function isEntityClassAki(classObj: Class): boolean {
    return false;
}

export function isEntityClass(classObj: Class): boolean {
    return isUe5() ? isEntityClassUe5(classObj) : isEntityClassAki(classObj);
}

export function isEntity(actor: Actor): boolean {
    const actorClass = actor.GetClass();
    return isEntityClass(actorClass) && getEntityTypeByClass(actorClass) !== undefined;
}

export function isPlayer(actor: Actor): boolean {
    return isObjChildOfClass(actor, playerClass);
}

export function genBlueprintConfig(): IBlueprintConfig {
    const keys = Array.from(blueprintByType.keys());
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    keys.sort();

    const entityByBlueprint: Record<string, TEntityType> = {};
    keys.forEach((key) => {
        entityByBlueprint[key] = blueprintByType.get(key).EntityType;
    });

    return {
        EntityByBlueprint: entityByBlueprint,
    };
}

export function compressEntityData(ed: IEntityData, td: IEntityTemplate): IEntityData {
    if (td === undefined) {
        return ed;
    }

    return {
        Name: ed.Name,
        Id: ed.Id,
        TemplateId: td.Id,
        BlueprintType: ed.BlueprintType,
        Transform: ed.Transform,
        ComponentsData: createDiff(ed.ComponentsData, td.ComponentsData, true) as TComponentsData,
    };
}

export function decompressEntityData(ed: IEntityData, td: IEntityTemplate): IEntityData {
    if (td === undefined) {
        return ed;
    }

    return {
        Name: ed.Name,
        Id: ed.Id,
        TemplateId: ed.TemplateId,
        BlueprintType: td.BlueprintType,
        Transform: ed.Transform,
        ComponentsData: applyDiff(ed.ComponentsData, td.ComponentsData, true) as TComponentsData,
    };
}
