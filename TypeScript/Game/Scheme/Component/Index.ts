import { FlowComponent } from '../../Component/FlowComponent';
import { componentRegistry } from './ComponentRegistry';
import { flowComponentScheme } from './FlowComponentScheme';

componentRegistry.RegisterClass(FlowComponent, flowComponentScheme);

export * from './ComponentRegistry';
export * from './FlowComponentScheme';
