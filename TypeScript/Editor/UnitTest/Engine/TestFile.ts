import { EFileRoot, MyFileHelper } from 'ue';

import { assertEq, test } from '../../../Editor/Common/Test';
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
}
