import { $ref, $unref } from 'puerts';
import { FileSystemOperation, KismetSystemLibrary } from 'ue';

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

const PROJECT_PATH = KismetSystemLibrary.GetProjectDirectory();
export function getProjectPath(file: string): string {
    return `${PROJECT_PATH}/${file}`;
}

const SAVE_PATH = KismetSystemLibrary.GetProjectSavedDirectory();
export function getSavePath(file: string): string {
    return `${SAVE_PATH}/${file}`;
}

export function readFile(path: string): string | undefined {
    const result = $ref<string>('');
    FileSystemOperation.ReadFile(path, result);
    return $unref(result);
}

export function writeFile(path: string, content: string): void {
    FileSystemOperation.WriteFile(path, content);
}
