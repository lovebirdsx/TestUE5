/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GameplayStatics, PlayerController } from 'ue';

import PlayerComponent from '../Component/PlayerComponent';
import { gameContext } from '../Interface';
import TsPlayer from './TSPlayer';

class TsPlayerController extends PlayerController {
    private MyPlayer: TsPlayer;

    public ReceiveBeginPlay(): void {
        gameContext.PlayerController = this;
        this.MyPlayer = GameplayStatics.GetPlayerCharacter(this.GetWorld(), 0) as TsPlayer;
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
