/* eslint-disable spellcheck/spell-checker */
import { initCommon } from '../Common/Init';
import { log } from '../Common/Log';
import { initEntity } from './Entity/Public';
import { GlobalActionsRunner } from './Flow/GlobalActionsRunner';
import { GameController } from './GameController';
import { EntityManager } from './Manager/EntityManager';
import { StateManager } from './Manager/StateManager';
import { TickManager } from './Manager/TickManager';

export class GameInstance {
    private readonly EntityManager = new EntityManager();

    private readonly GlobalActionsRunner = new GlobalActionsRunner();

    private readonly TickManager = new TickManager();

    private readonly StateManager = new StateManager();

    private readonly GameController = new GameController();

    public Init(): void {
        initCommon();
        initEntity(); // import Entity/Public 并不一定会调用initEntity,所以在此处强制调用

        this.TickManager.Init();
        this.StateManager.Init();
        this.GlobalActionsRunner.Init();
        this.EntityManager.Init();

        log('GameInstance Init()');

        this.GameController.Init();
    }

    public Exit(): void {
        this.GameController.Exit();

        this.EntityManager.Exit();
        this.GlobalActionsRunner.Exit();
        this.StateManager.Exit();
        this.TickManager.Exit();
        log('GameInstance Exit()');
    }

    public Tick(deltaTime: number): void {
        this.TickManager.Tick(deltaTime);
        this.EntityManager.Tick(deltaTime);
    }
}
