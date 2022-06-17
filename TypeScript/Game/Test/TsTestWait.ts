/* eslint-disable no-await-in-loop */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/naming-convention */
import { Actor } from 'ue';

import { delay } from '../../UniverseEditor/Common/Misc/Async';
import { log } from '../../UniverseEditor/Common/Misc/Log';

class TsTestWait extends Actor {
    public ReceiveBeginPlay(): void {
        void this.ATest();
    }

    //@no-blueprint
    private async ATest(): Promise<void> {
        for (let i = 0; i < 10; i++) {
            await delay(1);
            log(`TsTestWait wait count ${i}`);
        }
    }
}

export default TsTestWait;
