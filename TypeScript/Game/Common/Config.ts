import { DemoWorldSettings, EFileRoot, MyFileHelper, World } from 'ue';

function getFlowListDir(): string {
    return MyFileHelper.GetPath(EFileRoot.Content, 'Data/FlowList');
}

function getEntityTemplateDir(): string {
    return MyFileHelper.GetPath(EFileRoot.Content, 'Data/Template');
}

class GameConfig {
    public readonly FlowListDir = getFlowListDir();

    public readonly FlowListPrefix = '流程_';

    public readonly LevelDataDir = MyFileHelper.GetPath(EFileRoot.Content, 'Data/Map');

    public readonly LevelSaveDir = MyFileHelper.GetPath(EFileRoot.Save, 'Map');

    public readonly EntityTemplateDir = getEntityTemplateDir();

    public GetCurrentMapDataPath(world: World): string {
        const settings = world.K2_GetWorldSettings() as DemoWorldSettings;
        return `${this.LevelDataDir}/${settings.MapName}.json`;
    }

    public GetCurrentMapSavePath(world: World): string {
        const settings = world.K2_GetWorldSettings() as DemoWorldSettings;
        return `${this.LevelSaveDir}/${settings.MapName}.json`;
    }
}

export const gameConfig = new GameConfig();
