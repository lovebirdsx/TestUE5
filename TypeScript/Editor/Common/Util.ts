/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { $ref, $unref } from 'puerts';
import {
    BuiltinString,
    EditorLevelLibrary,
    EditorOperations,
    EFileRoot,
    EMsgType,
    KismetSystemLibrary,
    MyFileHelper,
    NewArray,
    Object as UeObject,
    PythonScriptLibrary,
} from 'ue';

import { readJsonObj, stringifyEditor, writeJson } from '../../Common/Util';

export function openDirOfFile(filepath: string): void {
    const command = [
        'import os',
        `path = os.path.normpath('${filepath}')`,
        `os.system(r'explorer /select, "{path}"'.format(path=path))`,
    ].join('\r\n');

    PythonScriptLibrary.ExecutePythonCommand(command);
}

export function openFile(filepath: string): void {
    const command = ['import os', `path = os.path.normpath('${filepath}')`, 'os.system(path)'].join(
        '\r\n',
    );
    PythonScriptLibrary.ExecutePythonCommand(command);
}

export function sendEditorCommand(command: string): void {
    const pythonCommand = [
        'import socket',
        'sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)',
        `sock.sendto(bytes('${command}', 'utf-8'), ('127.0.0.1', 8888))`,
    ].join('\r\n');

    PythonScriptLibrary.ExecutePythonCommand(pythonCommand);
}

interface IClipBoard {
    DataMap: Record<string, unknown>;
}

const CLIP_BOARD_SAVE_PATH = MyFileHelper.GetPath(EFileRoot.Save, 'ClipBoard.json');
const defalutClipBoard: IClipBoard = { DataMap: {} };

function saveClipBoard(clipBoard: IClipBoard): void {
    writeJson(clipBoard, CLIP_BOARD_SAVE_PATH);
}

function loadClipBoard(): IClipBoard {
    return readJsonObj(CLIP_BOARD_SAVE_PATH, defalutClipBoard);
}

export function copyObject(type: string, obj: unknown): void {
    const clipBoard = loadClipBoard();
    clipBoard.DataMap[type] = obj;
    saveClipBoard(clipBoard);
}

export function pasteObject<T>(type: string): T {
    const clipBoard = loadClipBoard();
    const data = clipBoard.DataMap[type];
    return data as T;
}

export function deepCopyData<T>(data: T): T {
    return JSON.parse(JSON.stringify(data)) as T;
}

export function mergeEditorToConfig<T>(config: T, editor: unknown): T {
    if (typeof config !== 'object' || typeof editor !== 'object') {
        throw new Error('Can only merge object');
    }

    for (const key in editor) {
        const v1 = config[key];
        const v2 = editor[key];
        if (typeof v2 === 'object') {
            // editor有可能落后于config,从而出现editor中多出的object
            // 由于editor的字段只可能存在于已有的config的object中,故而忽略
            if (typeof v1 === 'object') {
                config[key] = mergeEditorToConfig(v1, v2);
            }
        } else {
            if (v1 === undefined) {
                config[key] = v2;
            }
        }
    }
    return config;
}

export function genConfigWithoutEditor<T>(config: T): T {
    if (typeof config !== 'object') {
        throw new Error(`config type [${typeof config}] != object`);
    }

    const result: Record<string, unknown> = {};
    for (const key in config) {
        if (key.startsWith('_')) {
            continue;
        }

        const v = config[key];
        if (typeof v === 'object') {
            result[key] = genConfigWithoutEditor(v);
        } else {
            result[key] = v;
        }
    }

    if (config instanceof Array) {
        return Object.values(result) as unknown as T;
    }

    return result as T;
}

export function wirteEditorConfig(config: unknown, path: string): void {
    MyFileHelper.Write(stringifyEditor(config), path);
}

let macAddress = EditorOperations.GetMacAddress().toUpperCase();

// addr为12字节,大写, e.g. D8BBC1154BF3
// 该接口主要用于测试
export function setMacAddress(addr: string): void {
    macAddress = addr;
}

export function getMacAddress(): string {
    return macAddress;
}

// 获得对象所在资源相对于Content目录的路径(不包含扩展名)
// eg. /Game/Demo/Map/Demo => Demo/Map/Demo
export function getContentPackageName(obj: UeObject): string {
    const pkg = EditorOperations.GetPackage(obj);
    return pkg.GetName().substring(6);
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

export function getSeconds(): number {
    return KismetSystemLibrary.GetGameTimeInSeconds(EditorLevelLibrary.GetEditorWorld());
}
