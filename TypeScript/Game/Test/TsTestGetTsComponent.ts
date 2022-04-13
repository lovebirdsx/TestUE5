import { log } from '../../Editor/Common/Log';
import TsEntity from '../Entity/TsEntity';
import TsActionRunnerComponent from '../Flow/TsActionRunnerComponent';
import TsFlowComponent from '../Flow/TsFlowComponent';

class TsTestGetTsComponent extends TsEntity {
    public ReceiveBeginPlay(): void {
        log('TsTestGetTsComponent =====');
        const actionRunner = this.GetComponentByTsClass(TsActionRunnerComponent);
        log(`actionRunner name is ${actionRunner.GetName()}`);

        const flow = this.GetComponentByTsClass(TsFlowComponent);
        log(`flow name is ${flow.GetName()}`);
    }
}

export default TsTestGetTsComponent;
