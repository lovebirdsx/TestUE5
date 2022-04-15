"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-await-in-loop */
/* eslint-disable for-direction */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-for-of */
const puerts_1 = require("puerts");
const UE = require("ue");
const Async_1 = require("../../Common/Async");
const Common_1 = require("../../Editor/Common/Common");
const GlobalConfigCsv_1 = require("../../Editor/Common/CsvConfig/GlobalConfigCsv");
const Log_1 = require("../../Editor/Common/Log");
const FlowList_1 = require("../../Editor/Common/Operations/FlowList");
const CsvRegistry_1 = require("../../Editor/CsvEditor/CsvRegistry");
const TalkerList_1 = require("../../Editor/TalkerEditor/TalkerList");
const TsEntityComponent_1 = require("../Entity/TsEntityComponent");
const TsActionRunnerComponent_1 = require("./TsActionRunnerComponent");
class FlowContext {
    FlowInfo;
    FlowListInfo;
    ShowTalkInfo;
    StateId;
    Runner;
    constructor(flowListInfo, flowInfo, stateId, runner) {
        this.FlowListInfo = flowListInfo;
        this.FlowInfo = flowInfo;
        this.StateId = stateId;
        this.Runner = runner;
    }
    get IsTalkContext() {
        return this.FlowListInfo !== undefined;
    }
    get IsStateChangeable() {
        return this.FlowInfo !== undefined;
    }
}
class TsFlowComponent extends TsEntityComponent_1.default {
    // @no-blueprint
    ActionRunner;
    // @no-blueprint
    TalkerDisplay;
    // @no-blueprint
    FlowStack;
    // @no-blueprint
    NeedJumpTalk;
    // @no-blueprint
    NextTalkId;
    ReceiveBeginPlay() {
        const entity = this.GetOwner();
        this.ActionRunner = entity.GetComponentByTsClass(TsActionRunnerComponent_1.default);
        this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
        this.ActionRunner.RegisterActionFun('PlayFlow', this.ExecutePlayFlow.bind(this));
        this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));
        this.ActionRunner.RegisterActionFun('JumpTalk', this.ExecuteJumpTalk.bind(this));
        const playerController = UE.GameplayStatics.GetPlayerController(this.GetWorld(), 0);
        const tsHud = playerController.GetHUD();
        this.TalkerDisplay = tsHud.TalkerDisplay;
        this.FlowStack = [];
    }
    // @no-blueprint
    async ExecuteChangeState(actionInfo) {
        const currentFlow = this.FlowStack.pop();
        if (!currentFlow) {
            (0, Log_1.error)(`${this.Name}: ChangeState failed because no flow running`);
            return;
        }
        if (!currentFlow.FlowInfo) {
            (0, Log_1.error)(`${this.Name}: ChangeState failed because current flow is not state changeable`);
            return;
        }
        currentFlow.Runner.Stop();
        const changeState = actionInfo.Params;
        const flowInfo = currentFlow.FlowInfo;
        await this.RunFlow(currentFlow.FlowListInfo, flowInfo, changeState.StateId);
    }
    // @no-blueprint
    ExecuteFinishState(actionInfo) {
        let isSucceed = false;
        for (let i = this.FlowStack.length - 1; i >= 0; i--) {
            const flowContext = this.FlowStack[i];
            flowContext.Runner.Stop();
            if (flowContext.IsStateChangeable) {
                isSucceed = true;
                break;
            }
        }
        if (!isSucceed) {
            (0, Log_1.error)(`${this.Name}: FinishState failed because has not flow running`);
        }
    }
    // @no-blueprint
    GetTalkContext(actionType) {
        const currentFlow = this.FlowStack.at(-1);
        if (!currentFlow) {
            (0, Log_1.error)(`${actionType} failed: ${this.Name} has not flow running`);
            return undefined;
        }
        if (!currentFlow.FlowListInfo) {
            (0, Log_1.error)(`${actionType} failed: ${this.Name} has not flow running`);
            return undefined;
        }
        return currentFlow;
    }
    // @no-blueprint
    async ShowTalkItem(flowContext, item) {
        const who = TalkerList_1.TalkerListOp.GetName(TalkerList_1.TalkerListOp.Get(), item.WhoId);
        const texts = flowContext.FlowListInfo.Texts;
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
        await this.RunActions(item.Actions);
        if (item.Options) {
            const optionTexts = item.Options.map((op) => texts[op.TextId]);
            const ueOptionTexts = (0, Common_1.toUeArray)(optionTexts, UE.BuiltinText);
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
            await this.RunActions(option.Actions);
        }
        this.TalkerDisplay.HideAll();
    }
    // @no-blueprint
    async ExecuteShowTalk(actionInfo) {
        const currentFlow = this.GetTalkContext('ShowTalk');
        if (!currentFlow) {
            return;
        }
        const action = actionInfo.Params;
        const items = action.TalkItems;
        let currTalkId = 0;
        currentFlow.ShowTalkInfo = action;
        while (currTalkId < items.length && currentFlow.Runner.IsRunning) {
            if (currTalkId > 0) {
                await (0, Async_1.delay)(CsvRegistry_1.csvRegistry.GetCsv(GlobalConfigCsv_1.GlobalConfigCsv).GetConfig('TalkShowInterval'));
            }
            const item = items[currTalkId++];
            await this.ShowTalkItem(currentFlow, item);
            if (this.NeedJumpTalk) {
                this.NeedJumpTalk = false;
                currTalkId = this.NextTalkId;
            }
        }
    }
    // @no-blueprint
    ExecuteJumpTalk(actionInfo) {
        let context = undefined;
        for (let i = this.FlowStack.length - 1; i >= 0; i--) {
            const flowContext = this.FlowStack[i];
            if (!flowContext.ShowTalkInfo) {
                flowContext.Runner.Stop();
            }
            else {
                context = flowContext;
                break;
            }
        }
        if (!context) {
            (0, Log_1.error)(`${this.Name} JumpTalk failed: no talk flow found`);
            return;
        }
        const action = actionInfo.Params;
        this.NeedJumpTalk = true;
        this.NextTalkId = context.ShowTalkInfo.TalkItems.findIndex((e) => e.Id === action.TalkId);
    }
    // @no-blueprint
    async ExecutePlayFlow(actionInfo) {
        const playFlow = actionInfo.Params;
        const flowListName = playFlow.FlowListName;
        const flowListInfo = FlowList_1.flowListOp.LoadByName(flowListName);
        const flowId = playFlow.FlowId;
        const flowInfo = flowListInfo.Flows.find((flow0) => flow0.Id === flowId);
        if (!flowInfo) {
            (0, Log_1.error)(`[${flowListName}] No flow id for [${flowId}]`);
            return;
        }
        await this.RunFlow(flowListInfo, flowInfo, playFlow.StateId);
    }
    // @no-blueprint
    async RunActions(actions) {
        if (!actions) {
            return;
        }
        const handler = this.ActionRunner.SpawnHandler(actions);
        const context = new FlowContext(undefined, undefined, undefined, handler);
        this.FlowStack.push(context);
        await handler.Execute();
        if (this.FlowStack.at(-1) === context) {
            this.FlowStack.pop();
        }
    }
    // @no-blueprint
    async RunFlow(flowListInfo, flowInfo, stateId) {
        const state = flowInfo.States.find((state0) => state0.Id === stateId);
        if (!state) {
            (0, Log_1.error)(`[${flowInfo.Name}] no state for id [${stateId}]`);
            return;
        }
        (0, Log_1.log)(`[${this.Name}][${flowInfo.Name}] to state [${state.Name}]`);
        const handler = this.ActionRunner.SpawnHandler(state.Actions);
        const context = new FlowContext(flowListInfo, flowInfo, stateId, handler);
        this.FlowStack.push(context);
        await handler.Execute();
        if (this.FlowStack.at(-1) === context) {
            this.FlowStack.pop();
        }
    }
    // @no-blueprint
    async Interact(flowInfo) {
        if (this.FlowStack.length > 0) {
            (0, Log_1.error)(`Can not interact again while already interact`);
            return;
        }
        if (flowInfo.States.length <= 0) {
            return;
        }
        await this.RunFlow(undefined, flowInfo, flowInfo.States[0].Id);
    }
}
exports.default = TsFlowComponent;
//# sourceMappingURL=TsFlowComponent.js.map