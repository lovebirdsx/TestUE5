/* eslint-disable spellcheck/spell-checker */
import { NewObject } from 'ue';

import { getUeClassByTsClass } from '../../Common/Class';
import { assertEq, test } from '../../Common/Test';
import TsTrigger from '../../Game/Entity/TsTrigger';
import { editorEntityRegistry } from '../Common/Scheme/Entity/Index';

export default function testEntityScheme(): void {
    test('gen pure data', () => {
        const trigger = NewObject(getUeClassByTsClass(TsTrigger)) as TsTrigger;
        trigger.MaxTriggerTimes = 10;
        trigger.TriggerActionsJson = 'Hello';

        const pureData = editorEntityRegistry.GenData(trigger);
        assertEq(pureData.MaxTriggerTimes, trigger.MaxTriggerTimes, 'MaxTriggerTimes must equal');
        assertEq(
            pureData.TriggerActionsJson,
            trigger.TriggerActionsJson,
            'TriggerActions must equal',
        );
        assertEq(pureData.ActorHasTag, undefined, 'ActorHasTag must undefined');
    });

    test('write pure data', () => {
        const trigger = NewObject(getUeClassByTsClass(TsTrigger)) as TsTrigger;
        trigger.MaxTriggerTimes = 10;
        trigger.TriggerActionsJson = 'Hello';

        const pureData = editorEntityRegistry.GenData(trigger);
        pureData.MaxTriggerTimes = 11;

        editorEntityRegistry.ApplyData(pureData, trigger);
        assertEq(trigger.MaxTriggerTimes, pureData.MaxTriggerTimes, 'MaxTriggerTimes must equal');
    });
}
