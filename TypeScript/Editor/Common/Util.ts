/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EditorOperations, EFileRoot, MyFileHelper, PythonScriptLibrary } from 'ue';

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

export function mergeEditorToConfig(config: unknown, editor: unknown): object {
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
                config[key] = mergeEditorToConfig(
                    v1 as Record<string, unknown>,
                    v2 as Record<string, unknown>,
                );
            }
        } else {
            if (v1 === undefined) {
                config[key] = v2;
            }
        }
    }
    return config;
}

export function wirteEditorConfig(config: unknown, path: string): void {
    MyFileHelper.Write(stringifyEditor(config), path);
}

export function getMacAddress(): string {
    const addr = EditorOperations.GetMacAddress();
    return addr.toUpperCase();
}
