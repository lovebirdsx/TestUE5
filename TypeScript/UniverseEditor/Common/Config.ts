import { World } from 'ue';

import { getProjectPath, getSavePath, readFile } from './Misc/File';
import { log } from './Misc/Log';
import { writeJson } from './Misc/Util';

export class Config {
    public static readonly SavePath = getSavePath('Game/Config.json');

    public static readonly FlowListDir = getProjectPath('Content/Data/FlowList');

    public static readonly FlowListPrefix = '流程_';

    public static readonly LevelSaveDir = getSavePath('Map');

    public static readonly EntityTemplateDir = getProjectPath('Content/Data/Template/');

    // 退出Pie的时候是否自动保存游戏状态
    public IsSaveWhileExitPie: boolean;

    public constructor() {
        this.Load();
    }

    private Load(): void {
        const content = readFile(Config.SavePath);
        if (content) {
            const obj = JSON.parse(content) as object;
            Object.assign(this, obj);
        }

        log(`Load GameConfig: ${Config.SavePath}`);
    }

    public Save(): void {
        writeJson(this, Config.SavePath);
    }

    public static GetCurrentLevelSavePath(world: World): string {
        return `${this.LevelSaveDir}/${world.GetName()}.json`;
    }
}

export const config = new Config();
