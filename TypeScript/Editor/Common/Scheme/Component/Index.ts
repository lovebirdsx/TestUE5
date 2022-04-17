import { emptyObjectScheme } from '../../../../Common/Type';
import { ActionRunnerComponent } from '../../../../Game/Component/ActionRunnerComponent';
import { FlowComponent } from '../../../../Game/Component/FlowComponent';
import { TalkComponent } from '../../../../Game/Component/TalkComponent';
import { componentRegistry } from './ComponentRegistry';
import { flowComponentScheme } from './FlowComponentScheme';

componentRegistry.RegisterClass(ActionRunnerComponent, emptyObjectScheme);
componentRegistry.RegisterClass(FlowComponent, flowComponentScheme);
componentRegistry.RegisterClass(TalkComponent, emptyObjectScheme);

export * from './ComponentRegistry';
export * from './FlowComponentScheme';
