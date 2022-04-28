import { DemoGameInstance } from 'ue';

import { GameInstance } from './GameInstance';

class TsGameInstance extends DemoGameInstance {
    // @no-blueprint
    private Instance: GameInstance;

    public ReceiveTick(deltaSeconds: number): void {
        // 将GameInstance放在此处生成,是为了确保游戏中其它对象都已经生成完毕
        // 譬如 Player, PlayerController
        if (!this.Instance) {
            this.Instance = new GameInstance();
            this.Instance.Init(this.GetWorld());
        }
        this.Instance.Tick(deltaSeconds);
    }

    public ReceiveShutdown(): void {
        this.Instance.Exit();
    }
}

export default TsGameInstance;
