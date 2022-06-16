import { $ref, $unref } from 'puerts';
import { BuiltinString, EditorOperations, EFileRoot, MyFileHelper, NewArray } from 'ue';

import { log } from '../../Common/Misc/Log';

// Layer .raw files|*.raw|Layer .r8 files|*.r8|All files|*.*
export function testOpenFileDialog(): void {
    const filesRef = $ref(NewArray(BuiltinString));
    EditorOperations.OpenFileDialog('testOpenFileDialog', 'test.json', 'Json | *.json', filesRef);
    const files = $unref(filesRef);
    log(`file count ${files.Num()}`);
    for (let i = 0; i < files.Num(); i++) {
        const file = files.Get(i);
        log(
            `${file} ${MyFileHelper.GetPathRelativeTo(
                file,
                MyFileHelper.GetPath(EFileRoot.Content, ''),
            )}`,
        );
    }
}

export function testSaveFileDialog(): void {
    const filesRef = $ref(NewArray(BuiltinString));
    EditorOperations.SaveFileDialog('testOpenFileDialog', 'test.json', 'Json | *.json', filesRef);
    const files = $unref(filesRef);
    log(`file count ${files.Num()}`);
    for (let i = 0; i < files.Num(); i++) {
        const file = files.Get(i);
        log(
            `${file} ${MyFileHelper.GetPathRelativeTo(
                file,
                MyFileHelper.GetPath(EFileRoot.Content, ''),
            )}`,
        );
    }
}
