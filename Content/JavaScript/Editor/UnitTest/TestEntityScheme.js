"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Class_1 = require("../../Common/Class");
const Test_1 = require("../../Common/Test");
const TsTrigger_1 = require("../../Game/Entity/TsTrigger");
const Public_1 = require("../../Game/Scheme/Entity/Public");
function testEntityScheme() {
    (0, Test_1.test)('gen pure data', () => {
        const trigger = (0, ue_1.NewObject)((0, Class_1.getUeClassByTsClass)(TsTrigger_1.default));
        trigger.MaxTriggerTimes = 10;
        trigger.TriggerActionsJson = 'Hello';
        const pureData = Public_1.entitySchemeRegistry.GenData(trigger);
        (0, Test_1.assertEq)(pureData.MaxTriggerTimes, trigger.MaxTriggerTimes, 'MaxTriggerTimes must equal');
        (0, Test_1.assertEq)(pureData.TriggerActionsJson, trigger.TriggerActionsJson, 'TriggerActions must equal');
        (0, Test_1.assertEq)(pureData.ActorHasTag, undefined, 'ActorHasTag must undefined');
    });
    (0, Test_1.test)('write pure data', () => {
        const trigger = (0, ue_1.NewObject)((0, Class_1.getUeClassByTsClass)(TsTrigger_1.default));
        trigger.MaxTriggerTimes = 10;
        trigger.TriggerActionsJson = 'Hello';
        const pureData = Public_1.entitySchemeRegistry.GenData(trigger);
        pureData.MaxTriggerTimes = 11;
        Public_1.entitySchemeRegistry.ApplyData(pureData, trigger);
        (0, Test_1.assertEq)(trigger.MaxTriggerTimes, pureData.MaxTriggerTimes, 'MaxTriggerTimes must equal');
    });
}
exports.default = testEntityScheme;
//# sourceMappingURL=TestEntityScheme.js.map