"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showCenterTextScheme = void 0;
const Type_1 = require("../../../../Common/Type");
const ShowTalk_1 = require("./ShowTalk");
exports.showCenterTextScheme = (0, Type_1.createObjectScheme)({
    TextId: (0, ShowTalk_1.createTextIdScheme)('在屏幕上显示点啥吧!', {
        HideName: true,
        Width: 200,
        Tip: '在屏幕中心显示的内容',
    }),
}, {
    Scheduled: true,
    Filters: (0, Type_1.objectFilterExcept)(Type_1.EObjectFilter.Trigger),
});
//# sourceMappingURL=ShowText.js.map