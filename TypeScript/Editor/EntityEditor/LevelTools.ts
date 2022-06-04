import { EditorLevelLibrary, EFileRoot, MyFileHelper } from 'ue';

import { listFiles } from '../../Common/File';
import { readJsonObj } from '../../Common/Util';
import { GameConfig } from '../../Game/Common/GameConfig';
import { IEntityData } from '../../Game/Interface';

export type TLevelName = 'Demo' | 'TestTsEntity';

interface ILevelConfig {
    Name: TLevelName;
    ContentPath: string;
    IsPartition: boolean;
}

const levelConfigs: ILevelConfig[] = [
    { Name: 'Demo', ContentPath: 'Demo/Map/Demo', IsPartition: true },
    { Name: 'TestTsEntity', ContentPath: 'Test/TsEntity/TestTsEntity', IsPartition: false },
];

export class LevelTools {
    public static GetAllLevelNames(): TLevelName[] {
        return levelConfigs.map((level) => level.Name);
    }

    public static GetAllEntityDataPathOfCurrentLevel(): string[] {
        const world = EditorLevelLibrary.GetEditorWorld();
        return this.GetAllEntityDataPath(world.GetName() as TLevelName);
    }

    public static GetAllEntityDataPath(levelName: TLevelName): string[] {
        const levelConfig = levelConfigs.find((config) => config.Name === levelName);
        if (!levelConfig) {
            throw new Error(`No Level for name [${levelName}]`);
        }

        if (levelConfig.IsPartition) {
            return this.GetAllEntityDataPathForPartitionLevel(levelConfig.ContentPath);
        }
        return this.GetAllEntityDataPathForNormalLevel(levelConfig.ContentPath);
    }

    public static GetAllEntityData(levelName: TLevelName): IEntityData[] {
        const paths = this.GetAllEntityDataPath(levelName);
        return paths.map((path) => readJsonObj<IEntityData>(path));
    }

    public static GetAllEntityDataOfCurrentLevel(): IEntityData[] {
        const paths = this.GetAllEntityDataPathOfCurrentLevel();
        return paths.map((path) => readJsonObj<IEntityData>(path));
    }

    private static GetAllEntityDataPathForPartitionLevel(contentPath: string): string[] {
        const actorsDir = MyFileHelper.GetPath(
            EFileRoot.Content,
            `__ExternalActors__/${contentPath}`,
        );
        return listFiles(actorsDir, 'json', true);
    }

    private static GetAllEntityDataPathForNormalLevel(contentPath: string): string[] {
        const levelDir = MyFileHelper.GetPath(EFileRoot.Content, `${contentPath}_Entities`);
        return listFiles(levelDir, 'json', false);
    }

    public static GetAllEntityTemplatePath(): string[] {
        return listFiles(GameConfig.EntityTemplateDir, 'json', true);
    }

    public static FixEntityDataId(levelName: TLevelName): void {
        // const entityPaths = this.GetAllEntityDataPath(levelName);
    }

    public static FixAllEntityDataId(): void {
        this.GetAllLevelNames().forEach((levelName) => {
            this.FixEntityDataId(levelName);
        });
    }
}
