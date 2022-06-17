/* eslint-disable spellcheck/spell-checker */
import { World } from 'ue';

import { isUe5 } from '../Init';
import { getProjectPath } from '../Misc/File';
import { globalConfig } from './Global';
import { ILevelConfig, ILevelsConfig } from './ILevel';

const levelConfigsUe5: ILevelConfig[] = [
    {
        Id: 1,
        Name: 'Demo',
        ContentPath: 'Demo/Map/Demo',
        IsPartition: true,
    },
    {
        Id: 2,
        Name: 'WorldPartition',
        ContentPath: 'Test/WorldPartition/WorldPartition',
        IsPartition: true,
    },
    {
        Id: 3,
        Name: 'TestTsEntity',
        ContentPath: 'Test/TsEntity/TestTsEntity',
        IsPartition: false,
    },
];

const levelConfigAki: ILevelConfig[] = [];

export const levelsConfig: ILevelsConfig = {
    Levels: isUe5() ? levelConfigsUe5 : levelConfigAki,
};

function createLevelByName(): Map<string, ILevelConfig> {
    const result: Map<string, ILevelConfig> = new Map();
    levelConfigsUe5.forEach((config) => {
        result.set(config.Name, config);
    });
    return result;
}
const levelByName = createLevelByName();

export function getLevelDataPath(world: World): string | undefined {
    const levelConfig = levelByName.get(world.GetName());
    if (levelConfig) {
        return getProjectPath(`${globalConfig.LevelsDataDir}/${levelConfig.Id}/Level.json`);
    }
    return undefined;
}
