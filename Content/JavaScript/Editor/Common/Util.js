"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openFlowEditor = exports.sendEditorCommand = exports.openDirOfFile = exports.calHash = exports.deepEqualsIgnore = exports.deepEquals = void 0;
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const ue_1 = require("ue");
const ConfigFile_1 = require("../FlowEditor/ConfigFile");
const FlowList_1 = require("./Operations/FlowList");
function deepEquals(x, y) {
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
exports.deepEquals = deepEquals;
function deepEqualsIgnore(x, y, ignoreFields) {
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
exports.deepEqualsIgnore = deepEqualsIgnore;
function calHash(str) {
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
exports.calHash = calHash;
function openDirOfFile(filepath) {
    const command = [
        'import os',
        `path = os.path.normpath('${filepath}')`,
        `os.system(r'explorer /select, "{path}"'.format(path=path))`,
    ].join('\r\n');
    ue_1.PythonScriptLibrary.ExecutePythonCommand(command);
}
exports.openDirOfFile = openDirOfFile;
function sendEditorCommand(command) {
    const pythonCommand = [
        'import socket',
        'sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)',
        `sock.sendto(bytes('${command}', 'utf-8'), ('127.0.0.1', 8888))`,
    ].join('\r\n');
    ue_1.PythonScriptLibrary.ExecutePythonCommand(pythonCommand);
}
exports.sendEditorCommand = sendEditorCommand;
function openFlowEditor(flowName) {
    const configFile = new ConfigFile_1.ConfigFile();
    configFile.Load();
    configFile.FlowConfigPath = FlowList_1.flowListOp.GetPath(flowName);
    configFile.Save();
    sendEditorCommand('RestartFlowEditor');
}
exports.openFlowEditor = openFlowEditor;
//# sourceMappingURL=Util.js.map