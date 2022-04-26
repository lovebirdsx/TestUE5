import { log } from '../Common/Log';

export class GameInstance {
    public Init(): void {
        log('GameInstance Init()');
    }

    public Exit(): void {
        log('GameInstance Exit()');
    }

    public Tick(deltaTime: number): void {
        //
    }
}
