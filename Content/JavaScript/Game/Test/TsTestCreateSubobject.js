"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const Log_1 = require("../../Editor/Common/Log");
const TsActionRunnerComponent_1 = require("../Flow/TsActionRunnerComponent");
class TsTestCreateSubobject extends ue_1.Actor {
    ActionRunner;
    Constructor() {
        this.Test();
        this.Test2();
    }
    // @no-blueprint
    Test2() {
        const path = '/Game/ThirdPerson/Blueprints/BP_Task.BP_Task_C';
        const classObj = ue_1.Class.Load(path);
        if (!classObj) {
            (0, Log_1.error)(`Load class by ${path} failed`);
        }
        else {
            (0, Log_1.log)(`${path} name is ${classObj.GetName()}`);
        }
    }
    // @no-blueprint
    Test() {
        // 方法1：通过Class.Load加载，结果：失败
        let classObj = ue_1.Class.Load('/Game/Blueprints/TypeScript/Game/Flow/ActionRunner.ActionRunner_C');
        if (!classObj) {
            (0, Log_1.error)(`Load ActionRunner by Class.Load failed`);
        }
        else {
            (0, Log_1.log)(`Load ActionRunner class is ${classObj.GetName()}`);
        }
        // 方法1：通过makeUClass加载，结果：成功
        classObj = (0, puerts_1.makeUClass)(TsActionRunnerComponent_1.default);
        this.ActionRunner = this.CreateDefaultSubobject('ActionRunner', classObj, classObj, true, true, true);
        (0, Log_1.log)(`ActionRunner is ${this.ActionRunner.GetName()}`);
    }
}
exports.default = TsTestCreateSubobject;
//# sourceMappingURL=TsTestCreateSubobject.js.map