import { $ref } from 'puerts';
import { BuiltinString, MyFileHelper, NewArray } from 'ue';

import { toTsArray } from './Util';

export function getFileName(path: string): string {
    // eslint-disable-next-line no-useless-escape
    return path.replace(/^.*[\\\/]/, '');
}

export function getDir(path: string): string {
    let lastSepPosition = path.lastIndexOf('/');
    if (lastSepPosition === -1) {
        lastSepPosition = path.lastIndexOf('\\');
    }
    if (lastSepPosition === -1) {
        return '';
    }
    return path.slice(0, lastSepPosition);
}

export function removeExtension(filename: string): string {
    const lastDotPosition = filename.lastIndexOf('.');
    if (lastDotPosition === -1) {
        return filename;
    }
    return filename.slice(0, lastDotPosition);
}

export function getFileNameWithOutExt(path: string): string {
    return removeExtension(getFileName(path));
}

export function listFiles(dir: string, ext?: string, recursive?: boolean): string[] {
    const resultArray = NewArray(BuiltinString);
    if (ext === undefined) {
        // eslint-disable-next-line no-param-reassign
        ext = '';
    }

    if (recursive) {
        MyFileHelper.FindFilesRecursively($ref(resultArray), dir, ext);
    } else {
        MyFileHelper.FindFiles($ref(resultArray), dir, ext);
    }
    return toTsArray(resultArray);
}
