/* eslint-disable */
import type { ITransform } from "./Action";

export const protobufPackage = "aki";

/** Entity类型 */
export enum EEntity {
  AiNpc = 0,
  CharacterEntity = 1,
  Entity = 2,
  Lamp = 3,
  Npc = 4,
  RefreshEntity = 5,
  RefreshSingle = 6,
  Rotator = 7,
  SphereActor = 8,
  SphereFactory = 9,
  Spring = 10,
  SpringBoard = 11,
  StateEntity = 12,
  Switcher = 13,
  Trample = 14,
  Trigger = 15,
  Underground = 16,
  UNRECOGNIZED = -1,
}

/** 蓝图类型 */
export enum EBlueprint {
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
  BpSwitcher = 15,
  BpSpringBoard = 16,
  BpRefreshSingle = 17,
  BpRefreshEntity = 18,
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
  UNRECOGNIZED = -1,
}

export interface IComponentsList {
  /** EComponent中定义的枚举名字 */
  Components: string[];
}

export interface IEntityConfig {
  /** key为EEntity中的枚举名字 */
  ComponentsByEntity: { [key: string]: IComponentsList };
  /**
   * key为EBlueprint中定义的枚举名字
   * value为EEntity中的枚举名字
   */
  EntityByBlueprint: { [key: string]: string };
}

export interface IEntityConfig_ComponentsByEntityEntry {
  key: string;
  value: IComponentsList | undefined;
}

export interface IEntityConfig_EntityByBlueprintEntry {
  key: string;
  value: string;
}

export interface IEntityData {
  Id: number;
  Name?: string | undefined;
  /** EBlueprint中定义的枚举名字 */
  Blueprint: string;
  Transform?: ITransform | undefined;
  /** key为EComponent中定义的枚举值 */
  ComponentsData: { [key: number]: { [key: string]: any } | undefined };
}

export interface IEntityData_ComponentsDataEntry {
  key: number;
  value: { [key: string]: any } | undefined;
}

export interface IMap {
  EntityDatas: IEntityData[];
}
