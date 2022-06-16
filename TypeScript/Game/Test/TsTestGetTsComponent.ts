import { log } from '../../Common/Misc/Log';
import TsEntity from '../Entity/TsEntity';
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
