"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-param-reassign */
const immer_1 = require("immer");
const Test_1 = require("../../Common/Test");
function testImmer() {
    (0, Test_1.test)('no modify object', () => {
        const foo1 = {
            Bar: {
                Name: 'hello',
            },
        };
        const foo2 = (0, immer_1.default)(foo1, (draft) => { });
        (0, Test_1.assertEq)(foo1.Bar.Name, foo2.Bar.Name, 'field must equal');
        (0, Test_1.assertEq)(foo1.Bar, foo2.Bar, 'table must equal');
        (0, Test_1.assertEq)(foo1, foo2, 'object must equal');
    });
    (0, Test_1.test)('modify object', () => {
        const foo1 = {
            Bar: {
                Name: 'hello',
            },
            Baz: {
                Name: 'wolrd',
            },
        };
        const foo2 = (0, immer_1.default)(foo1, (draft) => {
            draft.Bar.Name = 'world';
        });
        (0, Test_1.assertNe)(foo1.Bar.Name, foo2.Bar.Name, 'field must not equal');
        (0, Test_1.assertNe)(foo1.Bar, foo2.Bar, 'table must not equal');
        (0, Test_1.assertNe)(foo1, foo2, 'object must not equal');
        (0, Test_1.assertEq)(foo1.Baz, foo2.Baz, 'other object must equal');
    });
}
exports.default = testImmer;
//# sourceMappingURL=TestImmer.js.map