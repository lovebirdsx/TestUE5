"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showCenterTextScheme = exports.centerTextIdScheme = void 0;
const Type_1 = require("../../../Common/Type");
const ShowTalk_1 = require("./ShowTalk");
exports.centerTextIdScheme = (0, ShowTalk_1.createTextIdScheme)('在屏幕上显示点啥吧!', {
    Name: 'CenterTextId',
    Width: 200,
    Tip: '在屏幕中心显示的内容',
});
exports.showCenterTextScheme = (0, Type_1.createObjectScheme)({
    Name: 'ShowCenterText',
    Fields: {
        TextId: exports.centerTextIdScheme,
    },
    Scheduled: true,
    Filters: (0, Type_1.actionFilterExcept)(Type_1.EActionFilter.Trigger),
});
//# sourceMappingURL=ShowText.js.map