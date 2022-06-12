// 全局配置的存放位置
export const GLOBAL_CONFIG_PATH = 'Content/Data/Json/Global.json';

// 全局配置, 路径相对于Content目录
export interface IGlobalConfig {
    // Component配置的路径(Json)
    ComponentConfigPath: string;

    // Entity配置路径(Json)
    EntityConfigPath: string;

    // Entity蓝图配置(CSV)
    EntityBpConfigPath: string;

    // 地图配置(CSV)
    LevelsConfigPath: string;

    // 地图目录
    LevelsDataDir: string;

    // 模板配置(Json)
    TemplateConfigPath: string;
}
