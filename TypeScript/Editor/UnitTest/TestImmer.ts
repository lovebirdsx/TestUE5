/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-param-reassign */
import produce from 'immer';

import { assertEq, assertNe, test } from '../../Common/Misc/Test';

export default function testImmer(): void {
    test('no modify object', () => {
        const foo1 = {
            Bar: {
                Name: 'hello',
            },
        };
        const foo2 = produce(foo1, (draft) => {});
        assertEq(foo1.Bar.Name, foo2.Bar.Name, 'field must equal');
        assertEq(foo1.Bar, foo2.Bar, 'table must equal');
        assertEq(foo1, foo2, 'object must equal');
    });

    test('modify object', () => {
        const foo1 = {
            Bar: {
                Name: 'hello',
            },
            Baz: {
                Name: 'wolrd',
            },
        };
        const foo2 = produce(foo1, (draft) => {
            draft.Bar.Name = 'world';
        });
        assertNe(foo1.Bar.Name, foo2.Bar.Name, 'field must not equal');
        assertNe(foo1.Bar, foo2.Bar, 'table must not equal');
        assertNe(foo1, foo2, 'object must not equal');

        assertEq(foo1.Baz, foo2.Baz, 'other object must equal');
    });
}
