/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import { log } from '../../../Common/Log';
import { assertEq, assertNe, test } from '../../../Common/Test';
import { parse, stringify, stringifyEditor, subArray } from '../../../Common/Util';
import { getMacAddress } from '../../Common/Util';

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

    test('sub array', () => {
        const a = ['a', 'b', 'c'];
        const b = ['a'];
        const c = subArray(a, b);
        assertEq(c.length, 2, 'c length must == 2');
        assertEq(c[0], 'b', 'c[0] must be b');
    });

    test('read mac address', () => {
        const mac = getMacAddress();
        assertNe(mac, undefined, 'mac must not undefined');
        assertEq(mac.length, 12, 'mac string length must be 12');
        log(mac);
    });
}
