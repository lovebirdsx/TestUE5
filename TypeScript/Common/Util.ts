export function getEnumValues(enumType: Record<number, string>): number[] {
    const valueNames = Object.keys(enumType).filter((item) => !Number.isNaN(Number(item)));
    return valueNames.map((name) => Number(name));
}

export function getEnumNames(enumType: Record<number, string>): string[] {
    const names = Object.keys(enumType).filter((item) => Number.isNaN(Number(item)));
    return names;
}
