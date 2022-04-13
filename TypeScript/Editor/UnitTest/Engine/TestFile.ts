/* eslint-disable @typescript-eslint/no-magic-numbers */
import { $ref } from 'puerts';
import { BuiltinString, EFileRoot, MyFileHelper, NewArray } from 'ue';

import { assertEq, assertTrue, test } from '../../../Editor/Common/Test';
import { toTsArray } from '../../Common/Common';
import { getFileName, getFileNameWithOutExt, removeExtension } from '../../Common/File';

export default function testFile(): void {
    test('read save file', () => {
        const file = MyFileHelper.GetPath(EFileRoot.Save, 'Test/Foo.txt');
        MyFileHelper.Write(file, 'Hello Test');
        const content = MyFileHelper.Read(file);
        assertEq(content, 'Hello Test', 'file read must equal to write');
    });

    test('read content file', () => {
        const file = MyFileHelper.GetPath(EFileRoot.Save, 'Test/Foo.txt');
        MyFileHelper.Write(file, 'Hello Test');
        const content = MyFileHelper.Read(file);
        assertEq(content, 'Hello Test', 'file read must equal to write');
    });

    test('getFileName', () => {
        assertEq(getFileName('hello/foo.json'), 'foo.json', 'getFileName failed');
        assertEq(removeExtension('foo.json'), 'foo', 'getFileName failed');
        assertEq(getFileNameWithOutExt('hello/foo.json'), 'foo', 'getFileName failed');
    });

    test('find files', () => {
        const dir = MyFileHelper.GetPath(EFileRoot.Save, 'Test/TestFindFiles');
        for (let i = 0; i < 3; i++) {
            MyFileHelper.Write(`${dir}/test${i}.test`, `test ${i}`);
        }

        const resultArray = NewArray(BuiltinString);
        MyFileHelper.FindFiles($ref(resultArray), dir, 'test');
        const fileNames = toTsArray(resultArray);
        assertEq(fileNames.length, 3, 'file count must equal');
        for (let i = 0; i < 3; i++) {
            const fileName = `${dir}/test${i}.test`;
            assertTrue(
                fileNames.includes(fileName),
                `file [${fileName}] not find for: [${fileNames.join(',')}]`,
            );
        }
    });
}
