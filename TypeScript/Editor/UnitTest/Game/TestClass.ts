/* eslint-disable spellcheck/spell-checker */
import { NewObject } from 'ue';

import { getUeClassByTsClass, isChildOf, isChildOfClass, isType } from '../../../Common/Class';
import { assertTrue, test } from '../../../Common/Test';
import TsEntity from '../../../Game/Entity/TsEntity';
import TsTrigger from '../../../Game/Entity/TsTrigger';

export default function testClass(): void {
    test('is child of class', () => {
        const classObj = getUeClassByTsClass(TsTrigger);
        const trigger = NewObject(classObj);
        assertTrue(isChildOfClass(trigger, TsTrigger), 'triggerobj must child of trigger class');
        assertTrue(isChildOfClass(trigger, TsEntity), 'triggerobj must child of entity class');
    });

    test('is child', () => {
        assertTrue(isChildOf(TsTrigger, TsEntity), 'trigger must child of entity');
    });

    test('is type', () => {
        const classObj = getUeClassByTsClass(TsTrigger);
        const trigger = NewObject(classObj);
        assertTrue(isType(trigger, TsTrigger), `trigger obj type must be trigger class`);
    });
}
