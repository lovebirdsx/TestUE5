"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const UE = require("ue");
const Async_1 = require("../../Common/Async");
class TsHud extends ue_1.HUD {
    // @no-blueprint
    UiTalkerDisplay;
    ReceiveBeginPlay() {
        const classObj = UE.Class.Load('/Game/Demo/UI/UI_TalkDisplayer.UI_TalkDisplayer_C');
        this.UiTalkerDisplay = ue_1.UMGManager.CreateWidget(this.GetWorld(), classObj);
        this.UiTalkerDisplay.AddToViewport();
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
        await (0, Async_1.delay)(2000);
        this.UiTalkerDisplay.ShowSubtile('小明', '今天天气不错');
        await (0, Async_1.delay)(2000);
        this.UiTalkerDisplay.ShowSubtile('小红', '是呀，要出去玩一下吗？');
        await (0, Async_1.delay)(2000);
        this.ShowOptions(['选项1', '选项2']);
        await (0, Async_1.delay)(2000);
        this.UiTalkerDisplay.HideOptions();
        await (0, Async_1.delay)(1000);
        this.ShowOptions(['选项1', '选项2', '选项3']);
        await (0, Async_1.delay)(2000);
        this.UiTalkerDisplay.HideOptions();
        await (0, Async_1.delay)(1000);
        this.ShowOptions(['选项1', '选项2', '选项3', '选项4']);
        await (0, Async_1.delay)(2000);
        this.UiTalkerDisplay.HideAll();
    }
}
exports.default = TsHud;
//# sourceMappingURL=TsHud.js.map