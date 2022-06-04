/* eslint-disable spellcheck/spell-checker */
import { TComponentType } from './Component';

export type TEntityType =
    | 'AiNpc'
    | 'Lamp'
    | 'Npc'
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
    AiNpc: ['FlowComponent', 'BehaviorFlowComponent', 'MoveComponent', 'EntitySpawnerComponent'],
    Lamp: ['EventComponent'],
    Npc: ['FlowComponent', 'BehaviorFlowComponent', 'EntitySpawnerComponent'],
    RefreshSingle: ['RefreshSingleComponent', 'EntitySpawnerComponent'],
    Rotator: ['RotatorComponent', 'EventComponent'],
    SphereActor: ['InteractiveComponent'],
    SphereFactory: ['SphereFactoryComponent', 'EntitySpawnerComponent', 'EventComponent'],
    Spring: ['SpringComponent'],
    SpringBoard: ['SimpleComponent'],
    StateEntity: ['ActorStateComponent', 'CalculateComponent', 'EntitySpawnerComponent'],
    Switcher: ['SwitcherComponent', 'EntitySpawnerComponent'],
    Trample: ['TrampleComponent', 'SimpleComponent'],
    Trigger: ['TriggerComponent', 'EntitySpawnerComponent'],
    Underground: ['UndergroundComponent', 'EventComponent'],
};
