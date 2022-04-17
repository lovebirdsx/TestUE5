/* eslint-disable no-await-in-loop */
/* eslint-disable for-direction */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { $ref } from 'puerts';
import * as UE from 'ue';

import { delay, delayByCondition, TCallback, waitCallback } from '../../Common/Async';
import { error } from '../../Common/Log';
import { toUeArray } from '../../Common/UeHelper';
import { csvRegistry } from '../Common/CsvConfig/CsvRegistry';
import { GlobalConfigCsv } from '../Common/CsvConfig/GlobalConfigCsv';
import { flowListOp } from '../Common/Operations/FlowList';
import { TalkerListOp } from '../Common/Operations/TalkerList';
import TsEntityComponent from '../Entity/TsEntityComponent';
import TsHud from '../Player/TsHud';
import {
    IActionInfo,
    IChangeState,
    IFlowInfo,
    IFlowListInfo,
    IJumpTalk,
    IPlayFlow,
    IShowTalk,
    ITalkItem,
    TActionType,
} from './Action';
// import TsActionRunnerComponent, { ActionRunnerHandler } from './TsActionRunnerComponent';

class FlowContext {
    public FlowInfo: IFlowInfo;

    public FlowListInfo: IFlowListInfo;

    public ShowTalkInfo: IShowTalk;

    public StateId: number;

    // public Runner: ActionRunnerHandler;

    public constructor(
        flowListInfo: IFlowListInfo,
        flowInfo: IFlowInfo,
        stateId: number,
        // runner: ActionRunnerHandler,
    ) {
        this.FlowListInfo = flowListInfo;
        this.FlowInfo = flowInfo;
        this.StateId = stateId;
        // this.Runner = runner;
    }

    public get IsTalkContext(): boolean {
        return this.FlowListInfo !== undefined;
    }

    public get IsStateChangeable(): boolean {
        return this.FlowInfo !== undefined;
    }
}

class TsFlowComponent extends TsEntityComponent {
    // @no-blueprint
    // private ActionRunner: TsActionRunnerComponent;

    // @no-blueprint
    private TalkerDisplay: UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;

    // @no-blueprint
    private FlowStack: FlowContext[];

    // @no-blueprint
    private NeedJumpTalk: boolean;

    // @no-blueprint
    private NextTalkId: number;

    public ReceiveBeginPlay(): void {
        // this.ActionRunner = this.GetComponent(TsActionRunnerComponent);
        // this.ActionRunner.RegisterActionFun('ChangeState', this.ExecuteChangeState.bind(this));
        // this.ActionRunner.RegisterActionFun('FinishState', this.ExecuteFinishState.bind(this));
        // this.ActionRunner.RegisterActionFun('PlayFlow', this.ExecutePlayFlow.bind(this));
        // this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));
        // this.ActionRunner.RegisterActionFun('FinishTalk', this.ExecuteFinishTalk.bind(this));
        // this.ActionRunner.RegisterActionFun('JumpTalk', this.ExecuteJumpTalk.bind(this));

        const playerController = UE.GameplayStatics.GetPlayerController(this.GetWorld(), 0);
        const tsHud = playerController.GetHUD() as TsHud;
        this.TalkerDisplay = tsHud.TalkerDisplay;

        this.FlowStack = [];
    }

    // @no-blueprint
    private async ExecuteChangeState(actionInfo: IActionInfo): Promise<void> {
        const currentFlow = this.FlowStack.pop();
        if (!currentFlow) {
            error(`${this.Name}: ChangeState failed because no flow running`);
            return;
        }

        if (!currentFlow.FlowInfo) {
            error(`${this.Name}: ChangeState failed because current flow is not state changeable`);
            return;
        }

        // currentFlow.Runner.Stop();
        const changeState = actionInfo.Params as IChangeState;
        const flowInfo = currentFlow.FlowInfo;
        await this.RunFlow(currentFlow.FlowListInfo, flowInfo, changeState.StateId);
    }

    // @no-blueprint
    private ExecuteFinishState(actionInfo: IActionInfo): void {
        let isSucceed = false;
        for (let i = this.FlowStack.length - 1; i >= 0; i--) {
            const flowContext = this.FlowStack[i];
            // flowContext.Runner.Stop();
            if (flowContext.IsStateChangeable) {
                isSucceed = true;
                break;
            }
        }

        if (!isSucceed) {
            error(`${this.Name}: FinishState failed because has not flow running`);
        }
    }

    // @no-blueprint
    private GetTalkContext(actionType: TActionType): FlowContext {
        const currentFlow = this.FlowStack.at(-1);
        if (!currentFlow) {
            error(`${actionType} failed: ${this.Name} has not flow running`);
            return undefined;
        }

        if (!currentFlow.FlowListInfo) {
            error(`${actionType} failed: ${this.Name} has not flow running`);
            return undefined;
        }

        return currentFlow;
    }

    // @no-blueprint
    private async ShowTalkItem(flowContext: FlowContext, item: ITalkItem): Promise<void> {
        const who = TalkerListOp.GetName(TalkerListOp.Get(), item.WhoId);
        const texts = flowContext.FlowListInfo.Texts;
        const content = texts[item.TextId];

        this.TalkerDisplay.ShowSubtile(who, content);

        // 等待固定时间
        const globalConfig = csvRegistry.GetCsv(GlobalConfigCsv);
        const waitTime = item.WaitTime || globalConfig.GetConfig('TalkJumpWaitTime');
        await delay(waitTime);

        let skipCallback: TCallback<void> = undefined;
        let isUserSkipTalk = false;
        this.TalkerDisplay.ShowSkipTip();
        this.TalkerDisplay.TalkSkipped.Clear();
        this.TalkerDisplay.TalkSkipped.Add(() => {
            isUserSkipTalk = true;
            skipCallback();
        });

        // 超时自动跳过
        const waitPromise = delayByCondition(
            globalConfig.GetConfig('TalkAutoJumpTime'),
            () => !isUserSkipTalk,
        );

        // 玩家点击
        const clickPromise = waitCallback((resolve) => {
            skipCallback = resolve;
        });
        await Promise.race([waitPromise, clickPromise]);

        await this.RunActions(item.Actions);

        if (item.Options) {
            const optionTexts = item.Options.map((op) => texts[op.TextId]);
            const ueOptionTexts = toUeArray(optionTexts, UE.BuiltinText);
            this.TalkerDisplay.ShowOptions($ref(ueOptionTexts));
            this.TalkerDisplay.OptionSelected.Clear();

            let selectOptionCallback: TCallback<string> = undefined;
            this.TalkerDisplay.OptionSelected.Add((text) => {
                selectOptionCallback(text);
            });

            const selectOptionText = await waitCallback<string>((resolve) => {
                selectOptionCallback = resolve;
            });

            const option = item.Options.find((op) => texts[op.TextId] === selectOptionText);
            await this.RunActions(option.Actions);
        }

        this.TalkerDisplay.HideAll();
    }

    // @no-blueprint
    private async ExecuteShowTalk(actionInfo: IActionInfo): Promise<void> {
        // const currentFlow = this.GetTalkContext('ShowTalk');
        // if (!currentFlow) {
        //     return;
        // }
        // const action = actionInfo.Params as IShowTalk;
        // const items = action.TalkItems;
        // let currTalkId = 0;
        // currentFlow.ShowTalkInfo = action;
        // while (currTalkId < items.length && currentFlow.Runner.IsRunning) {
        //     if (currTalkId > 0) {
        //         await delay(csvRegistry.GetCsv(GlobalConfigCsv).GetConfig('TalkShowInterval'));
        //     }
        //     const item = items[currTalkId++];
        //     await this.ShowTalkItem(currentFlow, item);
        //     if (this.NeedJumpTalk) {
        //         this.NeedJumpTalk = false;
        //         currTalkId = this.NextTalkId;
        //     }
        // }
    }

    // @no-blueprint
    private ExecuteFinishTalk(actionInfo: IActionInfo): void {
        let talkContext: FlowContext = undefined;
        for (let i = this.FlowStack.length - 1; i >= 0; i--) {
            const flowContext = this.FlowStack[i];
            // flowContext.Runner.Stop();
            if (flowContext.ShowTalkInfo) {
                talkContext = flowContext;
                break;
            }
        }

        if (!talkContext) {
            error(`${this.Name} FinishTalk failed: no talk flow found`);
        }
    }

    // @no-blueprint
    private ExecuteJumpTalk(actionInfo: IActionInfo): void {
        let context: FlowContext = undefined;
        for (let i = this.FlowStack.length - 1; i >= 0; i--) {
            const flowContext = this.FlowStack[i];
            if (!flowContext.ShowTalkInfo) {
                // flowContext.Runner.Stop();
            } else {
                context = flowContext;
                break;
            }
        }

        if (!context) {
            error(`${this.Name} JumpTalk failed: no talk flow found`);
            return;
        }

        const action = actionInfo.Params as IJumpTalk;
        this.NeedJumpTalk = true;
        this.NextTalkId = context.ShowTalkInfo.TalkItems.findIndex((e) => e.Id === action.TalkId);
    }

    // @no-blueprint
    private async ExecutePlayFlow(actionInfo: IActionInfo): Promise<void> {
        const playFlow = actionInfo.Params as IPlayFlow;
        const flowListName = playFlow.FlowListName;
        const flowListInfo = flowListOp.LoadByName(flowListName);
        const flowId = playFlow.FlowId;
        const flowInfo = flowListInfo.Flows.find((flow0) => flow0.Id === flowId);
        if (!flowInfo) {
            error(`[${flowListName}] No flow id for [${flowId}]`);
            return;
        }

        await this.RunFlow(flowListInfo, flowInfo, playFlow.StateId);
    }

    // @no-blueprint
    private async RunActions(actions: IActionInfo[]): Promise<void> {
        // if (!actions) {
        //     return;
        // }
        // const handler = this.ActionRunner.SpawnHandler(actions);
        // const context = new FlowContext(undefined, undefined, undefined, handler);
        // this.FlowStack.push(context);
        // await handler.Execute();
        // if (this.FlowStack.at(-1) === context) {
        //     this.FlowStack.pop();
        // }
    }

    // @no-blueprint
    private async RunFlow(
        flowListInfo: IFlowListInfo,
        flowInfo: IFlowInfo,
        stateId: number,
    ): Promise<void> {
        // const state = flowInfo.States.find((state0) => state0.Id === stateId);
        // if (!state) {
        //     error(`[${flowInfo.Name}] no state for id [${stateId}]`);
        //     return;
        // }
        // log(`[${this.Name}][${flowInfo.Name}] to state [${state.Name}]`);
        // const handler = this.ActionRunner.SpawnHandler(state.Actions);
        // const context = new FlowContext(flowListInfo, flowInfo, stateId, handler);
        // this.FlowStack.push(context);
        // await handler.Execute();
        // if (this.FlowStack.at(-1) === context) {
        //     this.FlowStack.pop();
        // }
    }

    // @no-blueprint
    public async Interact(flowInfo: IFlowInfo): Promise<void> {
        if (this.FlowStack.length > 0) {
            error(`Can not interact again while already interact`);
            return;
        }

        if (flowInfo.States.length <= 0) {
            return;
        }

        await this.RunFlow(undefined, flowInfo, flowInfo.States[0].Id);
    }
}

export default TsFlowComponent;
