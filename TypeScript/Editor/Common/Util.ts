/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { EFileRoot, MyFileHelper, PythonScriptLibrary } from 'ue';

import { readJsonObj, writeJsonConfig } from '../../Common/Util';

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
    writeJsonConfig(clipBoard, CLIP_BOARD_SAVE_PATH);
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
