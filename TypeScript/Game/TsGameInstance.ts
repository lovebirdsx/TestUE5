import { GameInstance } from 'ue';

import { log } from '../Editor/Common/Log';

class TsGameInstance extends GameInstance {
    public static Instance: TsGameInstance;

    public Constructor(): void {
        TsGameInstance.Instance = this;
    }

    public ReceiveInit(): void {
        log('TsGameInstance ReceiveInit');
    }

    public ReceiveShutdown(): void {
        log('TsGameInstance ReceiveShutdown');
    }
}

export default TsGameInstance;
