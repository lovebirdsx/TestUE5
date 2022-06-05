/* eslint-disable spellcheck/spell-checker */
import { actorStateComponentScheme } from './ActorStateComponentScheme';
import { calculateComponentScheme } from './CalculateComponentScheme';
import { componentRegistry } from './ComponentRegistry';
import { behaviorFlowComponentScheme, flowComponentScheme } from './FlowComponentScheme';
import { grabComponentScheme } from './GrabComponentScheme';
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

componentRegistry.RegisterClass('FlowComponent', flowComponentScheme);
componentRegistry.RegisterClass('BehaviorFlowComponent', behaviorFlowComponentScheme);
componentRegistry.RegisterClass('TriggerComponent', triggerComponentScheme);
componentRegistry.RegisterClass('MoveComponent', moveComponentScheme);
componentRegistry.RegisterClass('GrabComponent', grabComponentScheme);
componentRegistry.RegisterClass('RotatorComponent', rotatorComponentScheme);
componentRegistry.RegisterClass('TrampleComponent', trampleComponentScheme);
componentRegistry.RegisterClass('SpringComponent', springComponentScheme);
componentRegistry.RegisterClass('ActorStateComponent', actorStateComponentScheme);
componentRegistry.RegisterClass('SphereFactoryComponent', sphereFactorComponentScheme);
componentRegistry.RegisterClass('UndergroundComponent', undergroundActionsScheme);
componentRegistry.RegisterClass('CalculateComponent', calculateComponentScheme);
componentRegistry.RegisterClass('SwitcherComponent', switcherComponentScheme);
componentRegistry.RegisterClass('NpcComponent', npcComponentScheme);
componentRegistry.RegisterClass('SphereComponent', sphereComponentScheme);
componentRegistry.RegisterClass('RefreshSingleComponent', refreshSingleComponentScheme);
componentRegistry.RegisterClass('RefreshEntityComponent', refreshEntityComponentScheme);

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
