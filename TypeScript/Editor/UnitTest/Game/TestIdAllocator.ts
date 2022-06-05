/* eslint-disable spellcheck/spell-checker */
import { assertEq, assertError, test } from '../../../Common/Test';
import {
    GameIdAllocator,
    MAX_GAME_GEN_ID,
    MIN_GAME_GEN_ID,
} from '../../../Game/Common/Operations/Entity';

export default function testIdAllocator(): void {
    // 生成id, 释放id
    test('normal alloc and free', () => {
        const allocator = new GameIdAllocator('test');
        const id1 = allocator.Alloc();
        assertEq(id1, MIN_GAME_GEN_ID, `first alloc id must equal to ${MIN_GAME_GEN_ID}`);
        assertEq(allocator.AllocCount, 1, 'alloc count = 1');
        const id2 = allocator.Alloc();
        assertEq(id2, id1 + 1, `id2 = ${id1 + 1}`);
        assertEq(allocator.AllocCount, 2, 'alloc count = 2');
        allocator.Free(id2);
        assertEq(allocator.AllocCount, 1, 'alloc count = 1');
    });

    // 生成id的状态可以正常加载
    test('load prev save state', () => {
        const allocator1 = new GameIdAllocator('test');
        const allocCount = 10;
        for (let i = 0; i < allocCount; i++) {
            allocator1.Alloc();
        }
        allocator1.Save();

        const allocator2 = new GameIdAllocator('test');
        allocator2.Load();
        assertEq(allocator2.AllocCount, allocCount, `alloc count = ${allocCount}`);

        const id1 = allocator2.Alloc();
        const desireId1 = MIN_GAME_GEN_ID + allocCount;
        assertEq(id1, desireId1, `id1 = ${desireId1}`);
    });

    // 超出最大id, 新id将从最小值开始
    test('alloc while reach max id', () => {
        const allocator = new GameIdAllocator('test');
        const id1 = allocator.Alloc();
        const id2 = allocator.Alloc();
        allocator.SetLastGenId(MAX_GAME_GEN_ID - 1);
        const id3 = allocator.Alloc();
        assertEq(id3, MAX_GAME_GEN_ID, `id3 = ${MAX_GAME_GEN_ID}`);
        allocator.Free(id2);
        const id4 = allocator.Alloc();
        assertEq(id4, id2, `id4 = ${id2}`);
        allocator.Free(id1);
    });

    // 释放非法的id
    test(`free id not in range`, () => {
        const allocator = new GameIdAllocator('test');
        assertError('free not in range id must raise error', () => {
            const idNotInRange = MIN_GAME_GEN_ID - 1;
            allocator.Free(idNotInRange);
        });
    });
}
