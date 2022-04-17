"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-await-in-loop */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/naming-convention */
const ue_1 = require("ue");
const Async_1 = require("../../Common/Async");
const Log_1 = require("../../Common/Log");
class TsTestWait extends ue_1.Actor {
    ReceiveBeginPlay() {
        void this.ATest();
    }
    //@no-blueprint
    async ATest() {
        for (let i = 0; i < 10; i++) {
            await (0, Async_1.delay)(1);
            (0, Log_1.log)(`TsTestWait wait count ${i}`);
        }
    }
}
exports.default = TsTestWait;
//# sourceMappingURL=TsTestWait.js.map