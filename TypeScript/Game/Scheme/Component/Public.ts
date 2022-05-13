import ActorStateComponent from '../../Component/ActorStateComponent';
import { BehaviorFlowComponent } from '../../Component/BehaviorFlowComponent';
import { FlowComponent } from '../../Component/FlowComponent';
import { GrabComponent } from '../../Component/GrabComponent';
import MoveComponent from '../../Component/MoveComponent';
import { RotatorComponent } from '../../Component/RotatorComponent';
import { SpringComponent } from '../../Component/SpringComponent';
import { TrampleComponent } from '../../Component/TrampleComponent';
import { TriggerComponent } from '../../Component/TriggerComponent';
import { actorStateComponentScheme } from './ActorStateComponentScheme';
import { componentRegistry } from './ComponentRegistry';
import { behaviorFlowComponentScheme, flowComponentScheme } from './FlowComponentScheme';
import { grabComponentScheme } from './GrabComponentScheme';
import { moveComponentScheme } from './MoveComponentScheme';
import { rotatorComponentScheme } from './RotatorComponentScheme';
import { springComponentScheme } from './SpringComponentScheme';
import { trampleComponentScheme } from './TrampleComponentScheme';
import { triggerComponentScheme } from './TriggerComponentSheme';

componentRegistry.RegisterClass(FlowComponent, flowComponentScheme);
componentRegistry.RegisterClass(BehaviorFlowComponent, behaviorFlowComponentScheme);
componentRegistry.RegisterClass(TriggerComponent, triggerComponentScheme);
componentRegistry.RegisterClass(MoveComponent, moveComponentScheme);
componentRegistry.RegisterClass(GrabComponent, grabComponentScheme);
componentRegistry.RegisterClass(RotatorComponent, rotatorComponentScheme);
componentRegistry.RegisterClass(TrampleComponent, trampleComponentScheme);
componentRegistry.RegisterClass(SpringComponent, springComponentScheme);
componentRegistry.RegisterClass(ActorStateComponent, actorStateComponentScheme);

export * from './ActorStateComponentScheme';
export * from './ComponentRegistry';
export * from './FlowComponentScheme';
export * from './GrabComponentScheme';
export * from './MoveComponentScheme';
export * from './RotatorComponentScheme';
export * from './SpringComponentScheme';
export * from './TrampleComponentScheme';