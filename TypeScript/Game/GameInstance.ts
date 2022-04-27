import { World } from 'ue';

import { log } from '../Common/Log';
import { initEntity } from './Entity/Public';
import { EntityManager } from './Manager/EntityManager';

export class GameInstance {
    private readonly EntityManager = new EntityManager();

    public Init(world: World): void {
        initEntity();
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
