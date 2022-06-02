/* eslint-disable spellcheck/spell-checker */
import { assertEq, assertError, assertGt, assertNe, test } from '../../../Common/Test';
import { loadIdSegmentConfig, SegmentIdGenerator } from '../../Common/SegmentIdGenerator';
import { getMacAddress, setMacAddress } from '../../Common/Util';

export default function testConfig(): void {
    // 读取id生成器的配置
    test('entity id segment config', () => {
        const config = loadIdSegmentConfig();
        assertGt(config.length, 0, 'entity id segment config count must > 0');
        const row = config[0];
        assertNe(row.Name, undefined, 'Name must not be undefined');
        assertNe(row.MacAddress, undefined, 'MacAddress must not be undefined');
        assertNe(row.SegmentId, undefined, 'SegmentId must not be undefined');
    });

    // 创建generator出错
    test('entity id generator create error', () => {
        const originMacAddr = getMacAddress();
        assertError('create SegmentIdGenerator error while machine not registered', () => {
            setMacAddress('000000000000');
            const generator = new SegmentIdGenerator('entity');
            generator.GenOne();
        });
        setMacAddress(originMacAddr);
    });

    // 生成的id超出范围
    test('entity id generator id exhausted', () => {
        SegmentIdGenerator.RemoveRecordForConfig('entity');
        const generator = new SegmentIdGenerator('entity');
        generator.SaveWithId(generator.MaxId - 1);
        assertError('gen error while id exhausted', () => {
            generator.GenOne();
        });
    });

    // 生成逻辑
    test('entity id generator normal logic', () => {
        SegmentIdGenerator.RemoveRecordForConfig('entity');
        const generator = new SegmentIdGenerator('entity');
        const id = generator.GenOne();

        // 初始为min
        assertEq(id, generator.MinId, 'First gen must equal to min');

        // 接下来的为min + 1
        const id2 = generator.GenOne();
        assertEq(id2, id + 1, 'Second gen must equal to min + 1');

        // 重启编辑器, id可以保存
        const generator2 = new SegmentIdGenerator('entity');
        const id3 = generator2.GenOne();
        assertEq(id3, id2 + 1, 'Id gen while editor restart');
    });
}
