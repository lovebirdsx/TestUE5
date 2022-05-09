/* eslint-disable @typescript-eslint/no-magic-numbers */
import { assertEq, test } from '../../../Common/Test';
import { ITickable } from '../../../Game/Interface';
import { TickManager } from '../../../Game/Manager/TickManager';

export default function testTickManager(): void {
    test('add', () => {
        let tick1CallCount = 0;
        const tick1: ITickable = {
            Name: 'Tick1',
            Tick: (deltaTime: number) => {
                tick1CallCount++;
            },
        };
        const tickManager = new TickManager();
        tickManager.AddTick(tick1);
        tickManager.Tick(0);
        assertEq(tick1CallCount, 1, 'tick1 call count must = 1');
        tickManager.Tick(0);
        tickManager.Tick(0);
        assertEq(tickManager.TickCount, 1, 'tick count must = 0');
    });

    test('remove', () => {
        let tick1CallCount = 0;
        const tick1: ITickable = {
            Name: 'Tick1',
            Tick: (deltaTime: number) => {
                tick1CallCount++;
            },
        };
        const tickManager = new TickManager();
        tickManager.AddTick(tick1);
        tickManager.Tick(0);
        tickManager.Tick(0);
        tickManager.Tick(0);
        tickManager.RemoveTick(tick1);
        tickManager.Tick(0);
        tickManager.Tick(0);
        assertEq(tick1CallCount, 3, 'tick1 call count must = 3');
        assertEq(tickManager.TickCount, 0, 'tick count must = 0');
    });
}
