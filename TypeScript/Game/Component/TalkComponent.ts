/* eslint-disable no-await-in-loop */
/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import { BuiltinText, Game } from 'ue';

import { delay, delayByCondition, TCallback, waitCallback } from '../../Common/Async';
import { error } from '../../Common/Log';
import { toUeArray } from '../../Common/UeHelper';
import { csvRegistry } from '../Common/CsvConfig/CsvRegistry';
import { GlobalConfigCsv } from '../Common/CsvConfig/GlobalConfigCsv';
import { TalkerListOp } from '../Common/Operations/TalkerList';
import { IActionInfo, IFlowListInfo, IJumpTalk, IShowTalk, ITalkItem } from '../Flow/Action';
import { Component, gameContext } from '../Interface';
import TsHud from '../Player/TsHud';
import { ActionRunnerComponent, ActionRunnerHandler } from './ActionRunnerComponent';

export class TalkComponent extends Component {
    private ActionRunner: ActionRunnerComponent;

    private IsShowing: boolean;

    private FlowListInfo: IFlowListInfo;

    private ShowTalkInfo: IShowTalk;

    private TalkerDisplay: Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;

    private ActionsRunHandle: ActionRunnerHandler;

    private NeedJumpTalk: boolean;

    private NextTalkId: number;

    public OnInit(): void {
        this.ActionRunner = this.Entity.GetComponent(ActionRunnerComponent);

        const playerController = gameContext.PlayerController;
        const tsHud = playerController.GetHUD() as TsHud;
        this.TalkerDisplay = tsHud.TalkerDisplay;

        this.ActionRunner.RegisterActionFun('FinishTalk', this.ExecuteFinishTalk.bind(this));
        this.ActionRunner.RegisterActionFun('JumpTalk', this.ExecuteJumpTalk.bind(this));
    }

    private async ShowTalkItem(item: ITalkItem): Promise<void> {
        const who = TalkerListOp.GetName(TalkerListOp.Get(), item.WhoId);
        const texts = this.FlowListInfo.Texts;
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

        if (item.Actions) {
            this.ActionsRunHandle = this.ActionRunner.SpawnHandler(item.Actions);
            await this.ActionsRunHandle.Execute();
        }

        // 选项
        if (item.Options && this.IsShowing && !this.NeedJumpTalk) {
            const optionTexts = item.Options.map((op) => texts[op.TextId]);
            const ueOptionTexts = toUeArray(optionTexts, BuiltinText);
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
            this.ActionsRunHandle = this.ActionRunner.SpawnHandler(option.Actions);
            await this.ActionsRunHandle.Execute();
        }

        this.TalkerDisplay.HideAll();
    }

    public async Show(flowListInfo: IFlowListInfo, showTalk: IShowTalk): Promise<void> {
        if (this.IsShowing) {
            error(`${this.Name} Can not show talk again`);
            return;
        }

        const items = showTalk.TalkItems;
        this.IsShowing = true;
        this.FlowListInfo = flowListInfo;
        this.ShowTalkInfo = showTalk;
        let currentTalkId = 0;
        while (currentTalkId < items.length && this.IsShowing) {
            if (currentTalkId > 0) {
                await delay(csvRegistry.GetCsv(GlobalConfigCsv).GetConfig('TalkShowInterval'));
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

    private ExecuteFinishTalk(actionInfo: IActionInfo): void {
        this.IsShowing = false;
        if (this.ActionsRunHandle) {
            this.ActionsRunHandle.Stop();
        }
    }

    private ExecuteJumpTalk(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as IJumpTalk;
        this.NeedJumpTalk = true;
        this.NextTalkId = this.ShowTalkInfo.TalkItems.findIndex((e) => e.Id === action.TalkId);
    }
}
