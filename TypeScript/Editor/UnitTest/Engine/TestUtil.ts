/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import { log } from '../../../Common/Log';
import { assertEq, assertNe, test } from '../../../Common/Test';
import {
    compressObjByField,
    decompressObjByField,
    parse,
    stringify,
    stringifyEditor,
    subArray,
    TObject,
} from '../../../Common/Util';
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

    test('compress by field', () => {
        function testFor(origin: TObject, base: TObject, data: TObject): void {
            const result = compressObjByField(origin, base);
            assertEq(result, data, `compress(${JSON.stringify(origin)}, ${JSON.stringify(base)})`);
        }

        // 普通
        testFor({ A: 1 }, undefined, { A: 1 });
        testFor({ A: 1 }, { A: 1 }, undefined);
        testFor({ A: 1 }, { A: 1, B: 2 }, undefined);
        testFor({ A: 0 }, { A: 1 }, { A: 0 });
        testFor({ A: 1, B: 1 }, { A: 1 }, { B: 1 });
        testFor({ A: false }, { A: 1 }, { A: false });
        testFor({ A: false }, { A: [1, 2] }, { A: false });
        testFor({ A: false }, { A: { A: 1 } }, { A: false });

        // 嵌套
        testFor({ A: { B: 1 } }, { A: { B: 1 } }, undefined);
        testFor({ A: { B: 1, C: 1 } }, { A: { B: 1 } }, { A: { C: 1 } });
        testFor({ A: { B: 1, C: 1 } }, { A: {} }, { A: { B: 1, C: 1 } });
    });

    test('decompress by field', () => {
        function testFor(data: TObject, base: TObject, origin: TObject): void {
            const result = decompressObjByField(data, base);
            assertEq(
                result,
                origin,
                `decompress(${JSON.stringify(data)}, ${JSON.stringify(base)})`,
            );
        }

        // 普通
        testFor({ A: 1 }, undefined, { A: 1 });
        testFor(undefined, { A: 1 }, { A: 1 });
        testFor({ A: 0 }, { A: 1 }, { A: 0 });
        testFor({ B: 1 }, { A: 1, B: 1 }, { A: 1, B: 1 });
        testFor({ A: false }, { A: 1 }, { A: false });
        testFor({ A: false }, { A: [1, 2] }, { A: false });
        testFor({ A: false }, { A: { A: 1 } }, { A: false });

        // 嵌套
        testFor(undefined, { A: { B: 1 } }, { A: { B: 1 } });
        testFor({ A: { C: 1 } }, { A: { B: 1 } }, { A: { B: 1, C: 1 } });
        testFor({ A: { B: 1, C: 1 } }, { A: {} }, { A: { B: 1, C: 1 } });
    });
}
