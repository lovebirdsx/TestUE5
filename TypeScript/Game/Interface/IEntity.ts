import { ITransform } from './IAction';
import { TComponentType } from './IComponent';

export const entityTypeConfig = {
    AiNpc: 'AiNpc',
    CharacterEntity: 'CharacterEntity',
    Entity: 'Entity',
    Lamp: 'Lamp',
    Npc: 'Npc',
    RefreshEntity: 'RefreshEntity',
    RefreshSingle: 'RefreshSingle',
    Rotator: 'Rotator',
    SphereActor: 'SphereActor',
    SphereFactory: 'SphereFactory',
    Spring: 'Spring',
    SpringBoard: 'SpringBoard',
    StateEntity: 'StateEntity',
    Switcher: 'Switcher',
    Trample: 'Trample',
    Trigger: 'Trigger',
    Underground: 'Underground',
};

export type TEntityType = keyof typeof entityTypeConfig;

export type TComponentsByEntity = { [key in TEntityType]: TComponentType[] };

// 服务器: 从IGlobalConfig.EntityConfigPath中读取
export interface IEntityConfig {
    ComponentsByEntity: TComponentsByEntity;
}

// 服务器: 从IGlobalConfig.BlueprintConfigPath中读取
export interface IBlueprintConfig {
    EntityByBlueprint: Record<string, TEntityType>;
}

export type TComponentData = Record<string, unknown> & {
    Disabled: boolean;
};

// 代表Entity中所有组件的配置数据
// key为Component的名字
export type TComponentsData = Record<string, TComponentData>;

export interface IEntityTemplate {
    Id: number;
    Name: string;
    BlueprintType: string;
    ComponentsData: TComponentsData;
}

export interface IEntityData {
    Id: number;
    Name?: string;
    BlueprintType: string;
    Transform?: ITransform;
    ComponentsData: TComponentsData;
}

export interface IEntityTemplateConfig {
    Templates: IEntityTemplate[];
}
