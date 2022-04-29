import { GameplayStatics, World } from 'ue';

import { initCommon } from '../Common/Init';
import { log } from '../Common/Log';
import { initEntity } from './Entity/Public';
import { GlobalActionsRunner } from './Flow/GlobalActionsRunner';
import { IGameContext } from './Interface';
import { EntityManager } from './Manager/EntityManager';
import { TickManager } from './Manager/TickManager';
import TsPlayer from './Player/TsPlayer';
import TsPlayerController from './Player/TsPlayerController';

export class GameInstance {
    private readonly EntityManager = new EntityManager();

    private readonly GlobalActionsRunner = new GlobalActionsRunner();

    private readonly TickManager = new TickManager();

    public GameContext: IGameContext;

    public Init(world: World): void {
        initCommon();
        initEntity(); // import Entity/Public 并不一定会调用initEntity,所以在此处强制调用

        this.GameContext = {
            World: world,
            Player: GameplayStatics.GetPlayerPawn(world, 0) as TsPlayer,
            EntityManager: this.EntityManager,
            TickManager: this.TickManager,
            PlayerController: GameplayStatics.GetPlayerController(world, 0),
            GlobalActionsRunner: this.GlobalActionsRunner,
        };

        const playerController = this.GameContext.PlayerController as TsPlayerController;
        playerController.Context = this.GameContext;

        this.GlobalActionsRunner.Init(this.GameContext);
        this.EntityManager.Init(this.GameContext);
        log('GameInstance Init()');
    }

    public Exit(): void {
        this.EntityManager.Exit();
        this.GlobalActionsRunner.Exit();
        log('GameInstance Exit()');
    }

    public Tick(deltaTime: number): void {
        this.TickManager.Tick(deltaTime);
        this.EntityManager.Tick(deltaTime);
    }
}
