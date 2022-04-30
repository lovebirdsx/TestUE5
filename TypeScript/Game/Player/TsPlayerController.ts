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
        gameContext.EntityManager.Load();
    }

    public Save(): void {
        gameContext.EntityManager.Save();
    }
}

export default TsPlayerController;
