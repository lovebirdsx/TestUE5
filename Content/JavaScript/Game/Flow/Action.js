"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvCellTypeConfig = exports.cameraBindModeConfig = exports.plotModeConfig = exports.cameraModeConfig = exports.flowBoolOptionConfig = exports.logLeveConfig = exports.FLOW_LIST_VERSION = void 0;
/* eslint-disable spellcheck/spell-checker */
exports.FLOW_LIST_VERSION = 8;
exports.logLeveConfig = {
    Info: '提示',
    Warn: '警告',
    Error: '错误',
};
// Plot Node 相关动作 ============================================
exports.flowBoolOptionConfig = {
    DisableInput: '是否禁止输入',
    DisableViewControl: '是否禁止视角控制',
    HideUi: '是否隐藏其它UI',
    CanSkip: '是否可以跳过',
    CanInteractive: '是否可以交互',
};
exports.cameraModeConfig = {
    Drama: '剧情相机',
    Follow: '跟随',
    FollowDrama: '跟随相机剧情模式',
};
exports.plotModeConfig = {
    LevelA: 'A级演出',
    LevelB: 'B级演出',
    LevelC: 'C级演出',
    LevelD: 'D级演出',
};
// 绑定镜头的类型
exports.cameraBindModeConfig = {
    One: '1角色',
    Two: '2角色',
    Three: '3角色',
    None: '无',
};
// CSV中单元格值类型
exports.csvCellTypeConfig = {
    Int: '整形',
    String: '字符串',
    Float: '浮点型',
    Boolean: '布尔型',
};
//# sourceMappingURL=Action.js.map