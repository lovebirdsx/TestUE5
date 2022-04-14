/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PythonScriptLibrary } from 'ue';

import { ConfigFile } from '../FlowEditor/ConfigFile';
import { flowListOp } from './Operations/FlowList';

export function deepEquals<T>(x: T, y: T): boolean {
    if (x === y) {
        return true;
    }

    const typeX = typeof x;
    const typeY = typeof y;

    if (typeX !== typeY) {
        return false;
    }

    if (typeX !== 'object' || x === null || y === null) {
        return false;
    }

    for (const p in x) {
        if (!deepEquals(x[p], y[p])) {
            return false;
        }
    }

    for (const p in y) {
        if (x[p] === undefined) {
            return false;
        }
    }

    return true;
}

export function deepEqualsIgnore<T>(x: T, y: T, ignoreFields: string[]): boolean {
    if (x === y) {
        return true;
    }

    const typeX = typeof x;
    const typeY = typeof y;

    if (typeX !== typeY) {
        return false;
    }

    if (typeX !== 'object' || x === null || y === null) {
        return false;
    }

    for (const p in x) {
        if (ignoreFields.includes(p)) {
            continue;
        }

        if (!deepEqualsIgnore(x[p], y[p], ignoreFields)) {
            return false;
        }
    }

    for (const p in y) {
        if (ignoreFields.includes(p)) {
            continue;
        }

        if (x[p] === undefined) {
            return false;
        }
    }

    return true;
}

export function calHash(str: string): number {
    let hash = 0;
    const length = str.length;
    if (length === 0) {
        return hash;
    }

    for (let i = 0; i < length; i++) {
        const chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function openDirOfFile(filepath: string): void {
    const command = [
        'import os',
        `path = os.path.normpath('${filepath}')`,
        `os.system(r'explorer /select, "{path}"'.format(path=path))`,
    ].join('\r\n');

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

export function openFlowEditor(flowName: string): void {
    const configFile = new ConfigFile();
    configFile.Load();
    configFile.FlowConfigPath = flowListOp.GetPath(flowName);
    configFile.Save();

    sendEditorCommand('RestartFlowEditor');
}
