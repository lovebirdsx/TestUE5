/* eslint-disable spellcheck/spell-checker */
import { $ref, $unref } from 'puerts';
import {
    BuiltinString,
    ContainerKVType,
    EditorOperations,
    EMsgType,
    MyFileHelper,
    NewArray,
    SupportedContainerKVType,
    TArray,
} from 'ue';

export function toTsArray<T>(array: TArray<T>): T[] {
    const result = [] as T[];
    for (let i = 0; i < array.Num(); i++) {
        result.push(array.Get(i));
    }
    return result;
}

export function toUeArray<TR extends SupportedContainerKVType, T extends ContainerKVType<TR>>(
    array: T[],
    rt: TR,
): TArray<ContainerKVType<TR>> {
    const result = NewArray(rt);
    array.forEach((e) => {
        result.Add(e);
    });
    return result;
}

export function openLoadJsonFileDialog(defaultFile: string): string | undefined {
    const filesRef = $ref(NewArray(BuiltinString));
    if (
        EditorOperations.OpenFileDialog(
            'Open Json File',
            defaultFile,
            'Json File | *.json',
            filesRef,
        )
    ) {
        return MyFileHelper.GetAbsolutePath($unref(filesRef).Get(0));
    }
    return undefined;
}

export function openSaveJsonFileDialog(defaultFile: string): string | undefined {
    const filesRef = $ref(NewArray(BuiltinString));
    if (
        EditorOperations.SaveFileDialog(
            'Select Json File To Save',
            defaultFile,
            'Json File | *.json',
            filesRef,
        )
    ) {
        return MyFileHelper.GetAbsolutePath($unref(filesRef).Get(0));
    }
    return undefined;
}

export function openLoadCsvFileDialog(defaultFile: string): string | undefined {
    const filesRef = $ref(NewArray(BuiltinString));
    if (
        EditorOperations.OpenFileDialog('Open CSV File', defaultFile, 'CSV File | *.csv', filesRef)
    ) {
        return MyFileHelper.GetAbsolutePath($unref(filesRef).Get(0));
    }
    return undefined;
}

export function openSaveCsvFileDialog(defaultFile: string): string | undefined {
    const filesRef = $ref(NewArray(BuiltinString));
    if (
        EditorOperations.SaveFileDialog(
            'Select CSV File To Save',
            defaultFile,
            'CSV File | *.csv',
            filesRef,
        )
    ) {
        return MyFileHelper.GetAbsolutePath($unref(filesRef).Get(0));
    }
    return undefined;
}

export function msgbox(content: string): void {
    EditorOperations.ShowMessage(EMsgType.Ok, content, '提示');
}

export function errorbox(content: string): void {
    EditorOperations.ShowMessage(EMsgType.Ok, content, '错误');
}
