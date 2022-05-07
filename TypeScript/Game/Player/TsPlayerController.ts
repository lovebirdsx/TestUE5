/* eslint-disable @typescript-eslint/no-magic-numbers */
import { PlayerController } from 'ue';

import PlayerComponent from '../Component/PlayerComponent';
import { gameContext } from '../Interface';
import TsPlayer from './TSPlayer';

class TsPlayerController extends PlayerController {
    private get MyPlayer(): TsPlayer {
        return gameContext.Player as TsPlayer;
    }

    public ReceiveBeginPlay(): void {
        gameContext.PlayerController = this;
    }

    public SpeedUp(): void {
        this.MyPlayer.Speed = this.MyPlayer.Speed * 1.5;
    }

    public SpeedDown(): void {
        this.MyPlayer.Speed = this.MyPlayer.Speed * 0.75;
    }

    public ResetSpeed(): void {
        this.MyPlayer.ResetSpeed();
    }

    public Interact(): void {
        this.MyPlayer.Entity.GetComponent(PlayerComponent).TryInteract();
    }

    public Load(): void {
        // 由于流送由UE负责, 所以运行时直接加载之前保存的状态这个事情会变得非常复杂
        // 故而舍弃, 目前还是支持运行时保存游戏, 下次启动游戏会自动加载上次保存的游戏
        // gameContext.GameController.LoadGame();
    }

    public Save(): void {
        gameContext.GameController.SaveGame();
    }
}

export default TsPlayerController;
