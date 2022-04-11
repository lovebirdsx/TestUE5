"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Class_1 = require("../../../Common/Class");
const Test_1 = require("../../../Editor/Common/Test");
const TsEntity_1 = require("../../../Game/Entity/TsEntity");
const TsTrigger_1 = require("../../../Game/Entity/TsTrigger");
function testClass() {
    Test_1.test('is child of class', () => {
        const classObj = Class_1.getClassObj(TsTrigger_1.default);
        const trigger = ue_1.NewObject(classObj);
        Test_1.assertTrue(Class_1.isChildOfClass(trigger, TsTrigger_1.default), 'triggerobj must child of trigger class');
        Test_1.assertTrue(Class_1.isChildOfClass(trigger, TsEntity_1.default), 'triggerobj must child of entity class');
    });
    Test_1.test('is child', () => {
        Test_1.assertTrue(Class_1.isChildOf(TsTrigger_1.default, TsEntity_1.default), 'trigger must child of entity');
    });
    Test_1.test('is type', () => {
        const classObj = Class_1.getClassObj(TsTrigger_1.default);
        const trigger = ue_1.NewObject(classObj);
        Test_1.assertTrue(Class_1.isType(trigger, TsTrigger_1.default), `trigger obj type must be trigger class`);
    });
}
exports.default = testClass;
//# sourceMappingURL=TestClass.js.map