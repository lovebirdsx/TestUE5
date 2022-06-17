/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { $ref } from 'puerts';
import { BuiltinString, MyFileHelper, NewArray } from 'ue';

import {
    getFileName,
    getFileNameWithOutExt,
    getSavePath,
    readFile,
    removeExtension,
    writeFile,
} from '../../../Common/Misc/File';
import { assertEq, assertFalse, assertGt, assertTrue, test } from '../../../Common/Misc/Test';
import { toTsArray } from '../../../Common/Misc/Util';
import { listFiles } from '../../Common/Util';

export default function testFile(): void {
    test('read save file', () => {
        const file = getSavePath('Test/Subdir/Foo.txt');
        writeFile(file, 'Hello Test');
        const content = readFile(file);
        assertEq(content, 'Hello Test', 'file read must equal to write');
    });

    test('read content file', () => {
        const file = getSavePath('Test/Foo.txt');
        writeFile(file, 'Hello Test');
        const content = readFile(file);
        assertEq(content, 'Hello Test', 'file read must equal to write');
    });

    test('get file name', () => {
        assertEq(getFileName('hello/foo.json'), 'foo.json', 'getFileName failed');
        assertEq(removeExtension('foo.json'), 'foo', 'getFileName failed');
        assertEq(getFileNameWithOutExt('hello/foo.json'), 'foo', 'getFileName failed');
    });

    test('find files', () => {
        const dir = getSavePath('Test/TestFindFiles');
        for (let i = 0; i < 3; i++) {
            writeFile(`${dir}/test${i}.test`, `test ${i}`);
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

    test('list file', () => {
        const dir = getSavePath('Test/TestListFiles');
        const file1 = `${dir}/test1.test`;
        const file2 = `${dir}/test1/test1.json`;

        const fileSub1 = `${dir}/subDir/test1.test`;
        const fileSub2 = `${dir}/subDir/test1.json`;

        writeFile(file1, `file1`);
        writeFile(file2, `[]`);
        writeFile(fileSub1, `file2`);
        writeFile(fileSub2, `[]`);

        const files = listFiles(dir, 'test', true);
        assertEq(files.length, 2, 'file count must equal');
        assertTrue(files.includes(file1), `result must contain ${file1}`);
        assertTrue(files.includes(fileSub1), `result must contain ${fileSub1}`);

        const files2 = listFiles(dir, 'test', false);
        assertEq(files2.length, 1, 'file count must equal');
        assertTrue(files2.includes(file1), `result must contain ${file1}`);
        assertFalse(files2.includes(fileSub1), `result must contain ${fileSub1}`);
    });

    test('get file modify tick', () => {
        const file = getSavePath('Test/TestModifyTick/file1.txt');
        const tick1 = MyFileHelper.GetFileModifyTick(file);
        writeFile(file, 'hello');
        const tick2 = MyFileHelper.GetFileModifyTick(file);
        assertGt(tick2, tick1, `tick2 > tick1`);
    });
}
