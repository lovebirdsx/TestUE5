/* eslint-disable spellcheck/spell-checker */
import { ActorStateComponent } from '../../Component/ActorStateComponent';
import { BehaviorFlowComponent } from '../../Component/BehaviorFlowComponent';
import { CalculateComponent } from '../../Component/CalculateComponent';
import { EntitySpawnerComponent } from '../../Component/EntitySpawnerComponent';
import { EventComponent } from '../../Component/EventComponent';
import { FlowComponent } from '../../Component/FlowComponent';
import { GrabComponent } from '../../Component/GrabComponent';
import { MoveComponent } from '../../Component/MoveComponent';
import { NpcComponent } from '../../Component/NpcComponent';
import { RefreshEntityComponent, RefreshSingleComponent } from '../../Component/RefreshComponent';
import { RotatorComponent } from '../../Component/RotatorComponent';
import { SimpleComponent } from '../../Component/SimpleComponent';
import { SphereComponent } from '../../Component/SphereComponent';
import { SphereFactoryComponent } from '../../Component/SphereFactoryComponent';
import { SpringComponent } from '../../Component/SpringComponent';
import { SwitcherComponent } from '../../Component/SwitcherComponent';
import { TrampleComponent } from '../../Component/TrampleComponent';
import { TriggerComponent } from '../../Component/TriggerComponent';
import { UndergroundComponent } from '../../Component/UndergroundComponent';
import { actorStateComponentScheme } from './ActorStateComponentScheme';
import { calculateComponentScheme } from './CalculateComponentScheme';
import { componentRegistry } from './ComponentRegistry';
import { behaviorFlowComponentScheme, flowComponentScheme } from './FlowComponentScheme';
import { grabComponentScheme } from './GrabComponentScheme';
import {
    entitySpawnerComponentScheme,
    eventComponentScheme,
    simpleComponentScheme,
} from './HidedComponents';
import { npcComponentScheme, sphereComponentScheme } from './InteractComponentScheme';
import { moveComponentScheme } from './MoveComponentScheme';
import {
    refreshEntityComponentScheme,
    refreshSingleComponentScheme,
} from './RefreshComponentScheme';
import { rotatorComponentScheme } from './RotatorComponentScheme';
import { sphereFactorComponentScheme } from './SphereFactoryScheme';
import { springComponentScheme } from './SpringComponentScheme';
import { switcherComponentScheme } from './SwitcherComponentScheme';
import { trampleComponentScheme } from './TrampleComponentScheme';
import { triggerComponentScheme } from './TriggerComponentSheme';
import { undergroundActionsScheme } from './UndergroundScheme';

componentRegistry.RegisterClass(FlowComponent, flowComponentScheme);
componentRegistry.RegisterClass(BehaviorFlowComponent, behaviorFlowComponentScheme);
componentRegistry.RegisterClass(TriggerComponent, triggerComponentScheme);
componentRegistry.RegisterClass(MoveComponent, moveComponentScheme);
componentRegistry.RegisterClass(GrabComponent, grabComponentScheme);
componentRegistry.RegisterClass(RotatorComponent, rotatorComponentScheme);
componentRegistry.RegisterClass(TrampleComponent, trampleComponentScheme);
componentRegistry.RegisterClass(SpringComponent, springComponentScheme);
componentRegistry.RegisterClass(ActorStateComponent, actorStateComponentScheme);
componentRegistry.RegisterClass(SphereFactoryComponent, sphereFactorComponentScheme);
componentRegistry.RegisterClass(UndergroundComponent, undergroundActionsScheme);
componentRegistry.RegisterClass(CalculateComponent, calculateComponentScheme);
componentRegistry.RegisterClass(SwitcherComponent, switcherComponentScheme);
componentRegistry.RegisterClass(NpcComponent, npcComponentScheme);
componentRegistry.RegisterClass(SphereComponent, sphereComponentScheme);
componentRegistry.RegisterClass(EntitySpawnerComponent, entitySpawnerComponentScheme);
componentRegistry.RegisterClass(SimpleComponent, simpleComponentScheme);
componentRegistry.RegisterClass(EventComponent, eventComponentScheme);
componentRegistry.RegisterClass(RefreshSingleComponent, refreshSingleComponentScheme);
componentRegistry.RegisterClass(RefreshEntityComponent, refreshEntityComponentScheme);

export * from './ActorStateComponentScheme';
export * from './ComponentRegistry';
export * from './FlowComponentScheme';
export * from './GrabComponentScheme';
export * from './MoveComponentScheme';
export * from './RotatorComponentScheme';
export * from './SphereFactoryScheme';
export * from './SpringComponentScheme';
export * from './TrampleComponentScheme';
export * from './UndergroundScheme';
