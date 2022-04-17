/* eslint-disable spellcheck/spell-checker */
import { BuiltinInt } from 'ue';

import { assertEq, test } from '../../../Common/Test';
import { toTsArray, toUeArray } from '../../../Common/UeHelper';

export default function testContainer(): void {
    test('array', () => {
        const array = [1, 2];
        const ueArray1 = toUeArray(array, BuiltinInt);
        assertEq(ueArray1.Get(1), array[1], 'ueArray must equal');
        assertEq(ueArray1.Num(), array.length, 'ueArray len must equal');

        const array2 = toTsArray(ueArray1);
        assertEq(array2[1], ueArray1.Get(1), 'array must equal');
        assertEq(array2.length, ueArray1.Num(), 'ueArray len must equal');
    });

    test('map', () => {
        const map = new Map();
        map.set('Hello', 'World');
        assertEq('World', map.get('Hello'), 'map get must equal');
    });
}
