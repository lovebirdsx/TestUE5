import { log } from '../../Common/Log';
import { TsEntity } from '../Entity/Public';
// import TsActionRunnerComponent from '../Flow/TsActionRunnerComponent';
// import TsFlowComponent from '../Flow/TsFlowComponent';

class TsTestGetTsComponent extends TsEntity {
    public ReceiveBeginPlay(): void {
        log('TsTestGetTsComponent =====');
        // const actionRunner = this.GetComponent(TsActionRunnerComponent);
        // log(`actionRunner name is ${actionRunner.GetName()}`);

        // const flow = this.GetComponent(TsFlowComponent);
        // log(`flow name is ${flow.GetName()}`);
    }
}

export default TsTestGetTsComponent;
