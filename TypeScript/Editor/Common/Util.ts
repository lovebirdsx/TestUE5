/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PythonScriptLibrary } from 'ue';

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
