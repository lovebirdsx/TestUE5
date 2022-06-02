import { EFileRoot, MyFileHelper } from 'ue';

import { listFiles } from '../../Common/File';
import { GameConfig } from '../../Game/Common/GameConfig';

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
}
