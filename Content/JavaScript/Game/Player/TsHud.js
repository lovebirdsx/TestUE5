"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-void */
/* eslint-disable spellcheck/spell-checker */
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const UE = require("ue");
const Async_1 = require("../../Common/Async");
const Log_1 = require("../../Editor/Common/Log");
class TsHud extends ue_1.HUD {
    // @no-blueprint
    UiTalkerDisplay;
    Constructor() {
        const classObj = UE.Class.Load('/Game/Demo/UI/UI_TalkDisplayer.UI_TalkDisplayer_C');
        this.UiTalkerDisplay = ue_1.UMGManager.CreateWidget(this.GetWorld(), classObj);
    }
    ReceiveBeginPlay() {
        this.UiTalkerDisplay.AddToViewport();
        // void this.Test();
    }
    get TalkerDisplay() {
        return this.UiTalkerDisplay;
    }
    // @no-blueprint
    ShowOptions(optionTexts) {
        const ueArray = UE.NewArray(ue_1.BuiltinText);
        optionTexts.forEach((text) => {
            ueArray.Add(text);
        });
        this.UiTalkerDisplay.ShowOptions((0, puerts_1.$ref)(ueArray));
    }
    // @no-blueprint
    async Test() {
        await (0, Async_1.delay)(1);
        this.UiTalkerDisplay.ShowSubtile('小明', '今天天气不错');
        await (0, Async_1.delay)(1);
        this.UiTalkerDisplay.ShowSubtile('小红', '是呀，要出去玩一下吗？');
        let resolve = undefined;
        let optionText = undefined;
        await (0, Async_1.delay)(1);
        this.ShowOptions(['选项1', '选项2']);
        this.UiTalkerDisplay.OptionSelected.Clear();
        this.UiTalkerDisplay.OptionSelected.Add((text) => {
            resolve(text);
            optionText = text;
        });
        await (0, Async_1.waitCallback)((resolve0) => {
            resolve = resolve0;
        });
        (0, Log_1.log)(`你选择了[${optionText}]`);
        this.UiTalkerDisplay.HideOptions();
        await (0, Async_1.delay)(1);
        this.ShowOptions(['选项1', '选项2', '选项3']);
        await (0, Async_1.delay)(2);
        this.UiTalkerDisplay.HideOptions();
        await (0, Async_1.delay)(1);
        this.ShowOptions(['选项1', '选项2', '选项3', '选项4']);
        await (0, Async_1.delay)(2);
        this.UiTalkerDisplay.HideAll();
    }
}
exports.default = TsHud;
//# sourceMappingURL=TsHud.js.map