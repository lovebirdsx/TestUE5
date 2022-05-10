import { FlowComponent } from '../../Component/FlowComponent';
import { GrabComponent } from '../../Component/GrabComponent';
import { RotatorComponent } from '../../Component/RotatorComponent';
import { SpringComponent } from '../../Component/SpringComponent';
import { TrampleComponent } from '../../Component/TrampleComponent';
import { TriggerComponent } from '../../Component/TriggerComponent';
import { componentRegistry } from './ComponentRegistry';
import { flowComponentScheme } from './FlowComponentScheme';
import { grabComponentScheme } from './GrabComponentScheme';
import { rotatorComponentScheme } from './RotatorComponentScheme';
import { springComponentScheme } from './SpringComponentScheme';
import { trampleComponentScheme } from './TrampleComponentScheme';
import { triggerComponentScheme } from './TriggerComponentSheme';

componentRegistry.RegisterClass(FlowComponent, flowComponentScheme);
componentRegistry.RegisterClass(TriggerComponent, triggerComponentScheme);
componentRegistry.RegisterClass(GrabComponent, grabComponentScheme);
componentRegistry.RegisterClass(RotatorComponent, rotatorComponentScheme);
componentRegistry.RegisterClass(TrampleComponent, trampleComponentScheme);
componentRegistry.RegisterClass(SpringComponent, springComponentScheme);

export * from './ComponentRegistry';
export * from './FlowComponentScheme';
export * from './GrabComponentScheme';
export * from './RotatorComponentScheme';
export * from './SpringComponentScheme';
export * from './TrampleComponentScheme';
