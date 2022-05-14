/* eslint-disable spellcheck/spell-checker */
import { initCommon } from '../Common/Init';
import { log } from '../Common/Log';
import { initEntity } from './Entity/Public';
import { initFlow } from './Flow/Public';
import { GameController } from './GameController';
import { gameContext } from './Interface';
import { EntityManager } from './Manager/EntityManager';
import { StateManager } from './Manager/StateManager';
import { TickManager } from './Manager/TickManager';
import { TweenManager } from './Manager/TweenManager';

export class GameInstance {
    private readonly EntityManager = new EntityManager();

    private readonly TickManager = new TickManager();

    private readonly TweenManager = new TweenManager();

    private readonly StateManager = new StateManager();

    private readonly GameController = new GameController();

    public Init(): void {
        initCommon();
        initFlow();
        initEntity(); // import Entity/Public 并不一定会调用initEntity,所以在此处强制调用

        gameContext.TweenManager = this.TweenManager;

        this.TickManager.Init();
        this.StateManager.Init();
        this.EntityManager.Init();

        log('GameInstance Init()');

        this.GameController.Init();
    }

    public Exit(): void {
        this.GameController.Exit();

        this.EntityManager.Exit();
        this.StateManager.Exit();
        this.TickManager.Exit();
        log('GameInstance Exit()');
    }

    public Tick(deltaTime: number): void {
        this.TickManager.Tick(deltaTime);
        this.TweenManager.Tick(deltaTime);
        this.EntityManager.Tick(deltaTime);
    }
}
