import { FlowComponent } from '../../Component/FlowComponent';
import { TriggerComponent } from '../../Component/TriggerComponent';
import { componentRegistry } from './ComponentRegistry';
import { flowComponentScheme } from './FlowComponentScheme';
import { triggerComponentScheme } from './TriggerComponentSheme';

componentRegistry.RegisterClass(FlowComponent, flowComponentScheme);
componentRegistry.RegisterClass(TriggerComponent, triggerComponentScheme);

export * from './ComponentRegistry';
export * from './FlowComponentScheme';
