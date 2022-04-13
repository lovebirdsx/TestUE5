import { edit_on_instance, no_blueprint } from 'ue';

import { parseFlowInfo } from '../Flow/Action';
import TsActionRunnerComponent from '../Flow/TsActionRunnerComponent';
import TsFlowComponent from '../Flow/TsFlowComponent';
import TsEntity from './TsEntity';

class TsNpc extends TsEntity {
    @edit_on_instance()
    public FlowJson: string;

    @no_blueprint()
    private ActionRunner: TsActionRunnerComponent;

    @no_blueprint()
    private Flow: TsFlowComponent;

    public ReceiveBeginPlay(): void {
        this.ActionRunner = this.GetComponentByTsClass(TsActionRunnerComponent);
        this.Flow = this.GetComponentByTsClass(TsFlowComponent);

        this.Flow.Bind(parseFlowInfo(this.FlowJson));
    }
}

export default TsNpc;
