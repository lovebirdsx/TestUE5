import { World } from 'ue';

import { log } from '../Common/Log';
import { EntityManager } from './Manager/EntityManager';

export class GameInstance {
    private readonly EntityManager = new EntityManager();

    public Init(world: World): void {
        this.EntityManager.Init(world);
        log('GameInstance Init()');
    }

    public Exit(): void {
        this.EntityManager.Exit();
        log('GameInstance Exit()');
    }

    public Tick(deltaTime: number): void {
        this.EntityManager.Tick(deltaTime);
    }
}
