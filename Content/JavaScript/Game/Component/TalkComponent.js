"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkComponent = void 0;
/* eslint-disable no-await-in-loop */
/* eslint-disable spellcheck/spell-checker */
const puerts_1 = require("puerts");
const ue_1 = require("ue");
const Async_1 = require("../../Common/Async");
const Log_1 = require("../../Common/Log");
const UeHelper_1 = require("../../Common/UeHelper");
const CsvRegistry_1 = require("../Common/CsvConfig/CsvRegistry");
const GlobalConfigCsv_1 = require("../Common/CsvConfig/GlobalConfigCsv");
const TalkerList_1 = require("../Common/Operations/TalkerList");
const Interface_1 = require("../Interface");
const ActionRunnerComponent_1 = require("./ActionRunnerComponent");
class TalkComponent extends Interface_1.Component {
    ActionRunner;
    IsShowing;
    FlowListInfo;
    ShowTalkInfo;
    TalkerDisplay;
    ActionsRunHandle;
    NeedJumpTalk;
    NextTalkId;
    OnInit() {
        this.ActionRunner = this.Entity.GetComponent(ActionRunnerComponent_1.ActionRunnerComponent);
        const playerController = this.Context.PlayerController;
        const tsHud = playerController.GetHUD();
        this.TalkerDisplay = tsHud.TalkerDisplay;
        this.ActionRunner.RegisterActionFun('FinishTalk', this.ExecuteFinishTalk.bind(this));
        this.ActionRunner.RegisterActionFun('JumpTalk', this.ExecuteJumpTalk.bind(this));
    }
    async ShowTalkItem(item) {
        const who = TalkerList_1.TalkerListOp.GetName(TalkerList_1.TalkerListOp.Get(), item.WhoId);
        const texts = this.FlowListInfo.Texts;
        const content = texts[item.TextId];
        this.TalkerDisplay.ShowSubtile(who, content);
        // 等待固定时间
        const globalConfig = CsvRegistry_1.csvRegistry.GetCsv(GlobalConfigCsv_1.GlobalConfigCsv);
        const waitTime = item.WaitTime || globalConfig.GetConfig('TalkJumpWaitTime');
        await (0, Async_1.delay)(waitTime);
        let skipCallback = undefined;
        let isUserSkipTalk = false;
        this.TalkerDisplay.ShowSkipTip();
        this.TalkerDisplay.TalkSkipped.Clear();
        this.TalkerDisplay.TalkSkipped.Add(() => {
            isUserSkipTalk = true;
            skipCallback();
        });
        // 超时自动跳过
        const waitPromise = (0, Async_1.delayByCondition)(globalConfig.GetConfig('TalkAutoJumpTime'), () => !isUserSkipTalk);
        // 玩家点击
        const clickPromise = (0, Async_1.waitCallback)((resolve) => {
            skipCallback = resolve;
        });
        await Promise.race([waitPromise, clickPromise]);
        if (item.Actions) {
            this.ActionsRunHandle = this.ActionRunner.SpawnHandler(item.Actions);
            await this.ActionsRunHandle.Execute();
        }
        // 选项
        if (item.Options && this.IsShowing && !this.NeedJumpTalk) {
            const optionTexts = item.Options.map((op) => texts[op.TextId]);
            const ueOptionTexts = (0, UeHelper_1.toUeArray)(optionTexts, ue_1.BuiltinText);
            this.TalkerDisplay.ShowOptions((0, puerts_1.$ref)(ueOptionTexts));
            this.TalkerDisplay.OptionSelected.Clear();
            let selectOptionCallback = undefined;
            this.TalkerDisplay.OptionSelected.Add((text) => {
                selectOptionCallback(text);
            });
            const selectOptionText = await (0, Async_1.waitCallback)((resolve) => {
                selectOptionCallback = resolve;
            });
            const option = item.Options.find((op) => texts[op.TextId] === selectOptionText);
            this.ActionsRunHandle = this.ActionRunner.SpawnHandler(option.Actions);
            await this.ActionsRunHandle.Execute();
        }
        this.TalkerDisplay.HideAll();
    }
    async Show(flowListInfo, showTalk) {
        if (this.IsShowing) {
            (0, Log_1.error)(`${this.Name} Can not show talk again`);
            return;
        }
        const items = showTalk.TalkItems;
        this.IsShowing = true;
        this.FlowListInfo = flowListInfo;
        this.ShowTalkInfo = showTalk;
        let currentTalkId = 0;
        while (currentTalkId < items.length && this.IsShowing) {
            if (currentTalkId > 0) {
                await (0, Async_1.delay)(CsvRegistry_1.csvRegistry.GetCsv(GlobalConfigCsv_1.GlobalConfigCsv).GetConfig('TalkShowInterval'));
            }
            const item = items[currentTalkId++];
            await this.ShowTalkItem(item);
            if (this.NeedJumpTalk) {
                this.NeedJumpTalk = false;
                currentTalkId = this.NextTalkId;
            }
        }
        this.IsShowing = false;
    }
    ExecuteFinishTalk(actionInfo) {
        this.IsShowing = false;
        if (this.ActionsRunHandle) {
            this.ActionsRunHandle.Stop();
        }
    }
    ExecuteJumpTalk(actionInfo) {
        const action = actionInfo.Params;
        this.NeedJumpTalk = true;
        this.NextTalkId = this.ShowTalkInfo.TalkItems.findIndex((e) => e.Id === action.TalkId);
    }
}
exports.TalkComponent = TalkComponent;
//# sourceMappingURL=TalkComponent.js.map