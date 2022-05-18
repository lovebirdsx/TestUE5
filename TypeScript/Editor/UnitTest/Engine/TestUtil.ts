/* eslint-disable @typescript-eslint/naming-convention */
import { assertEq, test } from '../../../Common/Test';
import { parse, stringify, stringifyEditor } from '../../../Common/Util';

interface IFoo {
    Name: string;
    _Folded?: boolean;
    Bar?: {
        _Folded?: boolean;
    };
    _Bar?: {
        Name: string;
    };
}

export function testUtil(): void {
    test('stringify filter underScore', () => {
        const foo: IFoo = { Name: 'foo', _Folded: false };
        const fooJson = stringify(foo, true);
        const fooParsed = JSON.parse(fooJson) as IFoo;
        assertEq(fooParsed._Folded, undefined, '_Folded must be filtered');
    });

    test('stringify filter underScore nested', () => {
        const foo: IFoo = {
            Name: 'foo',
            _Folded: true,
            Bar: { _Folded: true },
            _Bar: { Name: '0' },
        };
        const fooJson = stringify(foo, true);
        const fooParsed = JSON.parse(fooJson) as IFoo;
        assertEq(fooParsed.Bar._Folded, undefined, '_Folded nested must be filtered');
        assertEq(fooParsed._Bar, undefined, '_Bar nested must be filtered');
    });

    test('stringifyEditor', () => {
        const foo: IFoo = {
            Name: 'foo',
            _Folded: true,
            Bar: { _Folded: true },
            _Bar: { Name: '0' },
        };
        const fooJson = stringifyEditor(foo);
        const fooParsed = JSON.parse(fooJson) as IFoo;
        assertEq(fooParsed.Bar._Folded, true, 'Bar._Folded must true');
        assertEq(fooParsed._Folded, true, '_Folded must true');
        assertEq(fooParsed.Name, undefined, 'Name must undefined');
        assertEq(fooParsed._Bar.Name, undefined, '_Bar.Name must undefined');
    });

    test('parse filter underScore', () => {
        const foo: IFoo = { Name: 'foo', _Folded: false };
        const fooJson = JSON.stringify(foo);
        const fooParsed = parse(fooJson, true) as IFoo;
        assertEq(fooParsed._Folded, undefined, '_Folded must be filtered');
    });

    test('parse filter underScore nested', () => {
        const foo: IFoo = {
            Name: 'foo',
            _Folded: true,
            Bar: { _Folded: true },
            _Bar: { Name: '0' },
        };
        const fooJson = JSON.stringify(foo);
        const fooParsed = parse(fooJson, true) as IFoo;
        assertEq(fooParsed.Bar._Folded, undefined, '_Folded nested must be filtered');
        assertEq(fooParsed._Bar, undefined, '_Bar nested must be filtered');
    });
}
