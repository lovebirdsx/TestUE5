"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEditorCommand = exports.openFile = exports.openDirOfFile = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const ue_1 = require("ue");
function openDirOfFile(filepath) {
    const command = [
        'import os',
        `path = os.path.normpath('${filepath}')`,
        `os.system(r'explorer /select, "{path}"'.format(path=path))`,
    ].join('\r\n');
    ue_1.PythonScriptLibrary.ExecutePythonCommand(command);
}
exports.openDirOfFile = openDirOfFile;
function openFile(filepath) {
    const command = ['import os', `path = os.path.normpath('${filepath}')`, 'os.system(path)'].join('\r\n');
    ue_1.PythonScriptLibrary.ExecutePythonCommand(command);
}
exports.openFile = openFile;
function sendEditorCommand(command) {
    const pythonCommand = [
        'import socket',
        'sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)',
        `sock.sendto(bytes('${command}', 'utf-8'), ('127.0.0.1', 8888))`,
    ].join('\r\n');
    ue_1.PythonScriptLibrary.ExecutePythonCommand(pythonCommand);
}
exports.sendEditorCommand = sendEditorCommand;
//# sourceMappingURL=Util.js.map