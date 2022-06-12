import { ITransform } from './IAction';
import { TComponentType } from './IComponent';

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

export type TComponentsByEntity = { [key in TEntityType]: TComponentType[] };

// 服务器: IEntityConfig从Config/Entity.json中读取
export interface IEntityConfig {
    ComponentsByEntity: TComponentsByEntity;
}

export type TComponentData = Record<string, unknown> & {
    Disabled: boolean;
};

// 代表Entity中所有组件的配置数据
// key为Component的名字
export type TComponentsData = Record<string, TComponentData>;

export interface IEntityTemplate {
    Id: number;
    Name?: string;
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
