/* eslint-disable spellcheck/spell-checker */
import { InteractiveComponent, ITsEntity, TComponentClass } from '../Interface';
import { getComponentsTypeByEntityType, getEntityTypeByActor } from '../Interface/Entity';
import { TComponentType } from '../Interface/IComponent';
import { TEntityType } from '../Interface/IEntity';
import { ActorStateComponent } from './ActorStateComponent';
import { BehaviorFlowComponent } from './BehaviorFlowComponent';
import { CalculateComponent } from './CalculateComponent';
import { EntitySpawnerComponent } from './EntitySpawnerComponent';
import { EventComponent } from './EventComponent';
import { FlowComponent } from './FlowComponent';
import { GrabComponent } from './GrabComponent';
import { LampComponent } from './LampComponent';
import { MoveComponent } from './MoveComponent';
import { NpcComponent } from './NpcComponent';
import { RefreshEntityComponent, RefreshSingleComponent } from './RefreshComponent';
import { RotatorComponent } from './RotatorComponent';
import { SimpleComponent } from './SimpleComponent';
import { SphereComponent } from './SphereComponent';
import { SphereFactoryComponent } from './SphereFactoryComponent';
import { SpringComponent } from './SpringComponent';
import { StateComponent } from './StateComponent';
import { SwitcherComponent } from './SwitcherComponent';
import { TalkComponent } from './TalkComponent';
import { TrampleComponent } from './TrampleComponent';
import { TriggerComponent } from './TriggerComponent';
import { SpringBoardComponent } from './TsSpringBoardComponent';
import { UndergroundComponent } from './UndergroundComponent';

export const componentByType: { [key in TComponentType]: TComponentClass } = {
    ActorStateComponent: ActorStateComponent,
    BehaviorFlowComponent: BehaviorFlowComponent,
    CalculateComponent: CalculateComponent,
    EntitySpawnerComponent: EntitySpawnerComponent,
    EventComponent: EventComponent,
    FlowComponent: FlowComponent,
    GrabComponent: GrabComponent,
    InteractiveComponent: InteractiveComponent,
    LampComponent: LampComponent,
    MoveComponent: MoveComponent,
    NpcComponent: NpcComponent,
    RefreshEntityComponent: RefreshEntityComponent,
    RefreshSingleComponent: RefreshSingleComponent,
    RotatorComponent: RotatorComponent,
    SimpleComponent: SimpleComponent,
    SphereComponent: SphereComponent,
    SphereFactoryComponent: SphereFactoryComponent,
    SpringBoardComponent: SpringBoardComponent,
    SpringComponent: SpringComponent,
    StateComponent: StateComponent,
    SwitcherComponent: SwitcherComponent,
    TalkComponent: TalkComponent,
    TrampleComponent: TrampleComponent,
    TriggerComponent: TriggerComponent,
    UndergroundComponent: UndergroundComponent,
};

const componentsByEntity: Map<TEntityType, TComponentClass[]> = new Map();

export function getComponentClassesByEntityType(entityType: TEntityType): TComponentClass[] {
    let result = componentsByEntity.get(entityType);
    if (!result) {
        const componentTypes = getComponentsTypeByEntityType(entityType);
        result = componentTypes.map((ct) => componentByType[ct]);
        componentsByEntity.set(entityType, result);
    }
    return result;
}

export function getComponentClassesByEntity(entity: ITsEntity): TComponentClass[] {
    const entityType = getEntityTypeByActor(entity);
    if (!entityType) {
        throw new Error(`No entity type for [${entity.Id}:${entity.ActorLabel}]`);
    }
    return getComponentClassesByEntityType(entityType);
}
