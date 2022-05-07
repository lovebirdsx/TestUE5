import { DemoGameInstance, GameplayStatics } from 'ue';

import { GameInstance } from './GameInstance';
import { gameContext } from './Interface';

class TsGameInstance extends DemoGameInstance {
    // @no-blueprint
    private Instance: GameInstance;

    public ReceiveInit(): void {
        this.Instance = new GameInstance();
        gameContext.World = this.GetWorld();
        gameContext.GameMode = GameplayStatics.GetGameMode(this.GetWorld());
        this.Instance.Init();
    }

    public ReceiveTick(deltaSeconds: number): void {
        this.Instance.Tick(deltaSeconds);
    }

    public ReceiveShutdown(): void {
        this.Instance.Exit();
    }
}

export default TsGameInstance;
