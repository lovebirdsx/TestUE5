import { emptyObjectScheme } from '../../../Common/Type';
import { ActionRunnerComponent } from '../../Component/ActionRunnerComponent';
import { FlowComponent } from '../../Component/FlowComponent';
import { TalkComponent } from '../../Component/TalkComponent';
import { componentRegistry } from './ComponentRegistry';
import { flowComponentScheme } from './FlowComponentScheme';

componentRegistry.RegisterClass(ActionRunnerComponent, emptyObjectScheme);
componentRegistry.RegisterClass(FlowComponent, flowComponentScheme);
componentRegistry.RegisterClass(TalkComponent, emptyObjectScheme);

export * from './ComponentRegistry';
export * from './FlowComponentScheme';
