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
