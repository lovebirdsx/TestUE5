import { DemoWorldSettings, EFileRoot, MyFileHelper, World } from 'ue';

import { log } from '../../Common/Log';
import { writeJson } from '../../Common/Util';

export class GameConfig {
    public static readonly SavePath = MyFileHelper.GetPath(EFileRoot.Save, 'Game/Config.json');

    public static readonly FlowListDir = MyFileHelper.GetPath(EFileRoot.Content, 'Data/FlowList');

    public static readonly FlowListPrefix = '流程_';

    public static readonly LevelDataDir = MyFileHelper.GetPath(EFileRoot.Content, 'Data/Map');

    public static readonly LevelSaveDir = MyFileHelper.GetPath(EFileRoot.Save, 'Map');

    public static readonly EntityTemplateDir = MyFileHelper.GetPath(
        EFileRoot.Content,
        'Data/Template',
    );

    // 退出Pie的时候是否自动保存游戏状态
    public IsSaveWhileExitPie: boolean;

    public constructor() {
        this.Load();
    }

    private Load(): void {
        const content = MyFileHelper.Read(GameConfig.SavePath);
        if (content) {
            const obj = JSON.parse(content) as object;
            Object.assign(this, obj);
        }

        log(`Load GameConfig: ${GameConfig.SavePath}`);
    }

    public Save(): void {
        writeJson(this, GameConfig.SavePath);
    }

    public static GetCurrentMapDataPath(world: World): string {
        const settings = world.K2_GetWorldSettings() as DemoWorldSettings;
        return `${this.LevelDataDir}/${settings.MapName}.json`;
    }

    public static GetCurrentMapSavePath(world: World): string {
        const settings = world.K2_GetWorldSettings() as DemoWorldSettings;
        return `${this.LevelSaveDir}/${settings.MapName}.json`;
    }
}

export const gameConfig = new GameConfig();
