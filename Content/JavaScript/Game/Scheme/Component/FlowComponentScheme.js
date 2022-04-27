"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flowComponentScheme = void 0;
const Type_1 = require("../../../Common/Type");
const Public_1 = require("../Action/Public");
exports.flowComponentScheme = (0, Type_1.createObjectScheme)({
    Name: 'FlowComponent',
    Fields: {
        InitState: Public_1.playFlowScheme,
    },
});
//# sourceMappingURL=FlowComponentScheme.js.map