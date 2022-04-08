"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigFile = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Log_1 = require("../Common/Log");
function getDefaultFlowListPath() {
    return ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, 'Editor/DefaultFlowList.csv');
}
class ConfigFile {
    static SavePath = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Save, 'Editor/FlowEditorConfig.json');
    // 剧情配置文件
    FlowConfigPath;
    // CSV导入和导出文件
    CsvExportPath;
    CsvImportPath;
    // 上一次打开的Csv文件路径
    CsvName;
    IsDevelop;
    static MaxHistory = 100;
    static AutoSaveInterval = 60;
    Load() {
        const content = ue_1.MyFileHelper.Read(ConfigFile.SavePath);
        if (content) {
            const obj = JSON.parse(content);
            Object.assign(this, obj);
        }
        if (!this.FlowConfigPath) {
            this.FlowConfigPath = getDefaultFlowListPath();
        }
        if (!this.CsvName) {
            this.CsvName = '对话人';
        }
        (0, Log_1.log)(`Load FlowEditor config: ${ConfigFile.SavePath}`);
    }
    Save() {
        const tabSize = 2;
        ue_1.MyFileHelper.Write(ConfigFile.SavePath, JSON.stringify(this, null, tabSize));
    }
}
exports.ConfigFile = ConfigFile;
//# sourceMappingURL=ConfigFile.js.map