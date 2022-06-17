import { getProjectPath } from './Misc/File';
import { readJsonObj } from './Misc/Util';

/* eslint-disable spellcheck/spell-checker */
export type TRuntimeType = 'aki' | 'ue5';

export interface IInitConfig {
    Runtime: TRuntimeType;
}

const defaultInitConfig: IInitConfig = {
    Runtime: 'aki',
};

export const initConfig = readJsonObj(
    getProjectPath('Content/Data/Json/Init.json'),
    defaultInitConfig,
);

export function isUe5(): boolean {
    return initConfig.Runtime === 'ue5';
}
