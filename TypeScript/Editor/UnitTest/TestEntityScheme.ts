/* eslint-disable spellcheck/spell-checker */
import { NewObject } from 'ue';

import { getClassObj } from '../../Common/Class';
import { assertEq, test } from '../../Editor/Common/Test';
import TsTrigger from '../../Game/Entity/TsTrigger';
import { entityScheme } from '../Common/Scheme/Entity/Index';

export default function testEntityScheme(): void {
    test('gen pure data', () => {
        const trigger = NewObject(getClassObj(TsTrigger)) as TsTrigger;
        trigger.MaxTriggerTimes = 10;
        trigger.TriggerActionsJson = 'Hello';

        const pureData = entityScheme.GenData(trigger);
        assertEq(pureData.MaxTriggerTimes, trigger.MaxTriggerTimes, 'MaxTriggerTimes must equal');
        assertEq(pureData.TriggerActionsJson, trigger.TriggerActionsJson, 'TriggerActions must equal');
        assertEq(pureData.ActorHasTag, undefined, 'ActorHasTag must undefined');
    });

    test('write pure data', () => {
        const trigger = NewObject(getClassObj(TsTrigger)) as TsTrigger;
        trigger.MaxTriggerTimes = 10;
        trigger.TriggerActionsJson = 'Hello';

        const pureData = entityScheme.GenData(trigger);
        pureData.MaxTriggerTimes = 11;

        entityScheme.ApplyData(pureData, trigger);
        assertEq(trigger.MaxTriggerTimes, pureData.MaxTriggerTimes, 'MaxTriggerTimes must equal');
    });
}
