"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Class_1 = require("../../../Common/Class");
const Test_1 = require("../../../Common/Test");
const Util_1 = require("../../../Common/Util");
const TsEntity_1 = require("../../../Game/Entity/TsEntity");
const TsTrigger_1 = require("../../../Game/Entity/TsTrigger");
function testClass() {
    (0, Test_1.test)('is child of class', () => {
        const classObj = (0, Class_1.getUeClassByTsClass)(TsTrigger_1.default);
        const trigger = (0, ue_1.NewObject)(classObj);
        (0, Test_1.assertTrue)((0, Class_1.isChildOfClass)(trigger, TsTrigger_1.default), 'triggerobj must child of trigger class');
        (0, Test_1.assertTrue)((0, Class_1.isChildOfClass)(trigger, TsEntity_1.default), 'triggerobj must child of entity class');
    });
    (0, Test_1.test)('is child', () => {
        (0, Test_1.assertTrue)((0, Class_1.isChildOf)(TsTrigger_1.default, TsEntity_1.default), 'trigger must child of entity');
    });
    (0, Test_1.test)('is type', () => {
        const classObj = (0, Class_1.getUeClassByTsClass)(TsTrigger_1.default);
        const trigger = (0, ue_1.NewObject)(classObj);
        (0, Test_1.assertTrue)((0, Class_1.isType)(trigger, TsTrigger_1.default), `trigger obj type must be trigger class`);
    });
    (0, Test_1.test)('load ue class', () => {
        const class1 = ue_1.Class.Load('Texture2D');
        (0, Test_1.assertEq)(class1, undefined, "Class.Load('Texture2D') must return undefined");
        const texStaticClass = ue_1.Texture2D.StaticClass();
        (0, Test_1.assertGt)((0, Util_1.getFieldCount)(texStaticClass), 3, 'Texture2D.StaticClass() fieldCount must > 3');
        const class3 = ue_1.Class.Load(`Blueprint'/Game/Test/CustomSequence/CustomSequence.CustomSequence_C'`);
        (0, Test_1.assertGt)((0, Util_1.getFieldCount)(class3), 8, 'Class.Load(blueprint) fieldCount must > 8');
    });
    (0, Test_1.test)('get asset list', () => {
        const searchPath1 = 'Test/CustomSequence';
        const seqClass1 = ue_1.Class.Load('/Game/Test/CustomSequence/CustomSequence.CustomSequence_C');
        const assetDatas1 = ue_1.EditorOperations.LoadAssetDataFromPath(searchPath1, seqClass1);
        (0, Test_1.assertGt)(assetDatas1.Num(), 0, 'Seq asset count > 0');
        const searchPath3 = 'Textures';
        const seqClass3 = ue_1.Texture2D.StaticClass();
        const assetDatas3 = ue_1.EditorOperations.LoadAssetDataFromPath(searchPath3, seqClass3);
        (0, Test_1.assertGt)(assetDatas3.Num(), 0, 'Texture asset(by Texture2D.StaticClass()) count > 0');
        const searchPath4 = 'Textures';
        const seqClass4 = (0, Util_1.loadClass)('Texture2D');
        const assetDatas4 = ue_1.EditorOperations.LoadAssetDataFromPath(searchPath4, seqClass4);
        (0, Test_1.assertGt)(assetDatas4.Num(), 0, "Texture asset(by Class.Load('Texture2D')) count == 0");
    });
}
exports.default = testClass;
//# sourceMappingURL=TestClass.js.map