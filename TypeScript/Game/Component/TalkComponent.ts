/* eslint-disable no-await-in-loop */
/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import { BuiltinText, Game, Rotator } from 'ue';

import { createCancleableDelay, createSignal, delay } from '../../Common/Async';
import { error } from '../../Common/Log';
import { toUeArray } from '../../Common/UeHelper';
import { calUpRotatorByPoints } from '../../Common/Util';
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

    private RotatorBeforeTalk: Rotator;

    public OnInit(): void {
        this.ActionRunner = this.Entity.GetComponent(ActionRunnerComponent);
        this.ActionRunner.RegisterActionFun('FinishTalk', this.ExecuteFinishTalk.bind(this));
        this.ActionRunner.RegisterActionFun('JumpTalk', this.ExecuteJumpTalk.bind(this));
    }

    public OnStart(): void {
        const playerController = gameContext.PlayerController;
        const tsHud = playerController.GetHUD() as TsHud;
        this.TalkerDisplay = tsHud.TalkerDisplay;
    }

    private async ShowTalkItem(item: ITalkItem): Promise<void> {
        const who = TalkerListOp.GetName(TalkerListOp.Get(), item.WhoId);
        const texts = this.FlowListInfo.Texts;
        const content = texts[item.TextId];

        this.TalkerDisplay.ShowSubtile(who, content.Text);

        // 等待固定时间
        const globalConfig = csvRegistry.GetCsv(GlobalConfigCsv);
        const waitTime = item.WaitTime || globalConfig.GetConfig('TalkJumpWaitTime');
        await delay(waitTime);

        this.TalkerDisplay.ShowSkipTip();
        this.TalkerDisplay.TalkSkipped.Clear();

        // 超时自动跳过
        const cancleableDelay = createCancleableDelay(globalConfig.GetConfig('TalkAutoJumpTime'));

        // 玩家点击
        const talkSkippedSignal = createSignal<boolean>();
        this.TalkerDisplay.TalkSkipped.Add(() => {
            talkSkippedSignal.Emit(true);
        });

        await Promise.race([cancleableDelay.Promise, talkSkippedSignal.Promise]);
        if (talkSkippedSignal.IsEmit()) {
            cancleableDelay.Cancel();
        }

        if (item.Actions) {
            this.ActionsRunHandle = this.ActionRunner.SpawnHandler(item.Actions);
            await this.ActionsRunHandle.Execute();
        }

        // 选项
        if (item.Options && this.IsShowing && !this.NeedJumpTalk) {
            const optionTexts = item.Options.map((op) => texts[op.TextId].Text);
            const ueOptionTexts = toUeArray(optionTexts, BuiltinText);
            this.TalkerDisplay.ShowOptions($ref(ueOptionTexts));
            this.TalkerDisplay.OptionSelected.Clear();

            const selectOptionSignal = createSignal<string>();
            this.TalkerDisplay.OptionSelected.Add((text) => {
                selectOptionSignal.Emit(text);
            });

            const selectOptionText = await selectOptionSignal.Promise;

            const option = item.Options.find((op) => texts[op.TextId].Text === selectOptionText);
            if (option.Actions) {
                this.ActionsRunHandle = this.ActionRunner.SpawnHandler(option.Actions);
                await this.ActionsRunHandle.Execute();
            }
        }

        this.TalkerDisplay.HideAll();
    }

    private async FaceToPlayer(): Promise<void> {
        const player = gameContext.Player;
        const self = this.Entity.Actor;
        const targetRotator = calUpRotatorByPoints(
            self.K2_GetActorLocation(),
            player.K2_GetActorLocation(),
        );
        await gameContext.TweenManager.RotatoToByZ(self, targetRotator, 0.5);
    }

    private async RestoreRotation(): Promise<void> {
        const self = this.Entity.Actor;
        await gameContext.TweenManager.RotatoToByZ(self, this.RotatorBeforeTalk, 0.5);
    }

    public async Show(flowListInfo: IFlowListInfo, showTalk: IShowTalk): Promise<void> {
        if (this.IsShowing) {
            error(`${this.Name} Can not show talk again`);
            return;
        }

        const items = showTalk.TalkItems;
        this.RotatorBeforeTalk = this.Entity.Actor.K2_GetActorRotation();
        this.IsShowing = true;
        this.FlowListInfo = flowListInfo;
        this.ShowTalkInfo = showTalk;
        let currentTalkId = 0;

        gameContext.Player.DisableInput(gameContext.PlayerController);

        await this.FaceToPlayer();

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

        gameContext.Player.EnableInput(gameContext.PlayerController);

        await this.RestoreRotation();

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
