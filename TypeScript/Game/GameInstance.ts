/* eslint-disable spellcheck/spell-checker */
import { initCommon } from '../Common/Misc/Init';
import { log } from '../Common/Misc/Log';
import { initFlow } from './Flow/Public';
import { GameController } from './GameController';
import { gameContext } from './Interface';
import { EntityManager } from './Manager/EntityManager';
import { LevelDataManager } from './Manager/LevelDataManager';
import { StateManager } from './Manager/StateManager';
import { TickManager } from './Manager/TickManager';
import { TweenManager } from './Manager/TweenManager';

export class GameInstance {
    private readonly EntityManager = new EntityManager();

    private readonly TickManager = new TickManager();

    private readonly TweenManager = new TweenManager();

    private readonly StateManager = new StateManager();

    private readonly GameController = new GameController();

    private readonly LevelDataManager = new LevelDataManager();

    public Init(): void {
        initCommon();
        initFlow();

        // 如果在TweenManager内部进行赋值, 则会出现循环依赖, 故而在此赋值
        gameContext.TweenManager = this.TweenManager;

        this.TickManager.Init();
        this.StateManager.Init();
        this.LevelDataManager.Init();
        this.EntityManager.Init();

        log('GameInstance Init()');

        this.GameController.Init();
    }

    public Exit(): void {
        this.GameController.Exit();

        this.EntityManager.Exit();
        this.StateManager.Exit();
        this.TickManager.Exit();
        this.LevelDataManager.Exit();
        log('GameInstance Exit()');
    }

    public Tick(deltaTime: number): void {
        this.TickManager.Tick(deltaTime);
        this.TweenManager.Tick(deltaTime);
        this.EntityManager.Tick(deltaTime);
    }
}
