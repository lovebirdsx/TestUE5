"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHeadIconVisibleScheme = exports.headIconScheme = void 0;
const Type_1 = require("../../../../Common/Type");
const ShowTalk_1 = require("./ShowTalk");
const DEFAULT_TEXTURE_PATH = '/Textures/J_01.J_01';
exports.headIconScheme = (0, Type_1.createAssetScheme)({
    CreateDefault: () => DEFAULT_TEXTURE_PATH,
    SearchPath: 'Textures',
    ClassPath: `Texture2D`,
});
exports.setHeadIconVisibleScheme = (0, Type_1.createObjectScheme)({
    Fields: {
        WhoId: ShowTalk_1.talkerIdScheme,
        Visible: (0, Type_1.createBooleanScheme)({
            Tip: '是否显示头像',
        }),
    },
});
//# sourceMappingURL=Talker.js.map