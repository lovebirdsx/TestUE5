/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Class, EditorOperations, Texture2D } from 'ue';

import { assertEq, assertGt, test } from '../../../Common/Misc/Test';
import { getFieldCount, loadClass } from '../../../Common/Misc/Util';

export default function testClass(): void {
    test('load ue class', () => {
        const class1 = Class.Load('Texture2D');
        assertEq(class1, undefined, "Class.Load('Texture2D') must return undefined");

        const texStaticClass = Texture2D.StaticClass();
        assertGt(getFieldCount(texStaticClass), 3, 'Texture2D.StaticClass() fieldCount must > 3');

        const class3 = Class.Load(
            `Blueprint'/Game/Test/CustomSequence/CustomSequence.CustomSequence_C'`,
        );
        assertGt(getFieldCount(class3), 8, 'Class.Load(blueprint) fieldCount must > 8');
    });

    test('get asset list', () => {
        const searchPath1 = 'Test/CustomSequence';
        const seqClass1 = Class.Load('/Game/Test/CustomSequence/CustomSequence.CustomSequence_C');
        const assetDatas1 = EditorOperations.LoadAssetDataFromPath(searchPath1, seqClass1);
        assertGt(assetDatas1.Num(), 0, 'Seq asset count > 0');

        const searchPath3 = 'Textures';
        const seqClass3 = Texture2D.StaticClass();
        const assetDatas3 = EditorOperations.LoadAssetDataFromPath(searchPath3, seqClass3);
        assertGt(assetDatas3.Num(), 0, 'Texture asset(by Texture2D.StaticClass()) count > 0');

        const searchPath4 = 'Textures';
        const seqClass4 = loadClass('Texture2D');
        const assetDatas4 = EditorOperations.LoadAssetDataFromPath(searchPath4, seqClass4);
        assertGt(assetDatas4.Num(), 0, "Texture asset(by Class.Load('Texture2D')) count == 0");
    });

    test('class equal', () => {
        const class1 = Class.Load('/Game/Test/CustomSequence/CustomSequence.CustomSequence_C');
        const class2 = Class.Load('/Game/Test/CustomSequence/CustomSequence.CustomSequence_C');
        assertEq(class1, class2, `${class1.GetName()} must equal to ${class2.GetName()}`);
    });
}
