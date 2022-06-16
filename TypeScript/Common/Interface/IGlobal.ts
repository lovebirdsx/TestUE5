// 全局配置的存放位置
export const GLOBAL_CONFIG_PATH = 'Content/Data/Json/Global.json';

// 全局配置, 路径相对于Project目录
export interface IGlobalConfig {
    // Component配置的路径(Json)
    ComponentConfigPath: string;

    // Entity配置路径(Json)
    EntityConfigPath: string;

    // Entity蓝图配置(Json)
    BlueprintConfigPath: string;

    // 动态模型蓝图路径
    DynamicModelBluePrintPath: string;

    // Entity模型配置(Json)
    BlueprintModelConfigPath: string;

    // 地图配置(Json)
    LevelsConfigPath: string;

    // 地图目录
    LevelsDataDir: string;

    // 模板配置(Json)
    TemplateConfigPath: string;
}
