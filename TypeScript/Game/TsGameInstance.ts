import { DemoGameInstance } from 'ue';

import { GameInstance } from './GameInstance';

class TsGameInstance extends DemoGameInstance {
    // @no-blueprint
    private Instance: GameInstance;

    public ReceiveInit(): void {
        this.Instance = new GameInstance();
        this.Instance.Init(this.GetWorld());
    }

    public ReceiveTick(deltaSeconds: number): void {
        this.Instance.Tick(deltaSeconds);
    }

    public ReceiveShutdown(): void {
        this.Instance.Exit();
    }
}

export default TsGameInstance;
