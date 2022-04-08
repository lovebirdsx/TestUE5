"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Common_1 = require("../../../Editor/Common/Common");
const Test_1 = require("../../../Editor/Common/Test");
function testContainer() {
    (0, Test_1.test)('array', () => {
        const array = [1, 2];
        const ueArray1 = (0, Common_1.toUeArray)(array, ue_1.BuiltinInt);
        (0, Test_1.assertEq)(ueArray1.Get(1), array[1], 'ueArray must equal');
        (0, Test_1.assertEq)(ueArray1.Num(), array.length, 'ueArray len must equal');
        const array2 = (0, Common_1.toTsArray)(ueArray1);
        (0, Test_1.assertEq)(array2[1], ueArray1.Get(1), 'array must equal');
        (0, Test_1.assertEq)(array2.length, ueArray1.Num(), 'ueArray len must equal');
    });
    (0, Test_1.test)('map', () => {
        const map = new Map();
        map.set('Hello', 'World');
        (0, Test_1.assertEq)('World', map.get('Hello'), 'map get must equal');
    });
}
exports.default = testContainer;
//# sourceMappingURL=TestContainer.js.map