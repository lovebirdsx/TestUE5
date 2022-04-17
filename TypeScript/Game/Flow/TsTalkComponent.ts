/* eslint-disable spellcheck/spell-checker */
// /* eslint-disable spellcheck/spell-checker */
// import { Game, GameplayStatics } from 'ue';
// import { TalkerListOp } from '../../Editor/TalkerEditor/TalkerList';

// import TsEntityComponent from '../Entity/TsEntityComponent';
// import TsHud from '../Player/TsHud';
// import { ITalkItem } from './Action';
// import TsActionRunnerComponent from './TsActionRunnerComponent';

// class TsTalkComponent extends TsEntityComponent {
//     // @no-blueprint
//     private ActionRunner: TsActionRunnerComponent;

//     // @no-blueprint
//     private TalkerDisplay: Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;

//     // @no-blueprint

//     public ReceiveBeginPlay(): void {
//         this.ActionRunner = this.GetComponent(TsActionRunnerComponent);
//         this.ActionRunner.RegisterActionFun('ShowTalk', this.ExecuteShowTalk.bind(this));
//         this.ActionRunner.RegisterActionFun('FinishTalk', this.ExecuteFinishTalk.bind(this));
//         this.ActionRunner.RegisterActionFun('JumpTalk', this.ExecuteJumpTalk.bind(this));

//         const playerController = GameplayStatics.GetPlayerController(this.GetWorld(), 0);
//         const tsHud = playerController.GetHUD() as TsHud;
//         this.TalkerDisplay = tsHud.TalkerDisplay;
//     }

//     // @no-blueprint
//     private async ShowTalkItem(item: ITalkItem): Promise<void> {
//         // const who = TalkerListOp.GetName(TalkerListOp.Get(), item.WhoId);
//         // const texts = flowContext.FlowListInfo.Texts;
//         // const content = texts[item.TextId];

//         // this.TalkerDisplay.ShowSubtile(who, content);

//         // // 等待固定时间
//         // const globalConfig = csvRegistry.GetCsv(GlobalConfigCsv);
//         // const waitTime = item.WaitTime || globalConfig.GetConfig('TalkJumpWaitTime');
//         // await delay(waitTime);

//         // let skipCallback: TCallback<void> = undefined;
//         // let isUserSkipTalk = false;
//         // this.TalkerDisplay.ShowSkipTip();
//         // this.TalkerDisplay.TalkSkipped.Clear();
//         // this.TalkerDisplay.TalkSkipped.Add(() => {
//         //     isUserSkipTalk = true;
//         //     skipCallback();
//         // });

//         // // 超时自动跳过
//         // const waitPromise = delayByCondition(
//         //     globalConfig.GetConfig('TalkAutoJumpTime'),
//         //     () => !isUserSkipTalk,
//         // );

//         // // 玩家点击
//         // const clickPromise = waitCallback((resolve) => {
//         //     skipCallback = resolve;
//         // });
//         // await Promise.race([waitPromise, clickPromise]);

//         // await this.RunActions(item.Actions);

//         // if (item.Options) {
//         //     const optionTexts = item.Options.map((op) => texts[op.TextId]);
//         //     const ueOptionTexts = toUeArray(optionTexts, UE.BuiltinText);
//         //     this.TalkerDisplay.ShowOptions($ref(ueOptionTexts));
//         //     this.TalkerDisplay.OptionSelected.Clear();

//         //     let selectOptionCallback: TCallback<string> = undefined;
//         //     this.TalkerDisplay.OptionSelected.Add((text) => {
//         //         selectOptionCallback(text);
//         //     });

//         //     const selectOptionText = await waitCallback<string>((resolve) => {
//         //         selectOptionCallback = resolve;
//         //     });

//         //     const option = item.Options.find((op) => texts[op.TextId] === selectOptionText);
//         //     await this.RunActions(option.Actions);
//         // }

//         // this.TalkerDisplay.HideAll();
//     }

//     // @no-blueprint
//     private async ExecuteShowTalk(actionInfo: IActionInfo): Promise<void> {
//         // const currentFlow = this.GetTalkContext('ShowTalk');
//         // if (!currentFlow) {
//         //     return;
//         // }

//         // const action = actionInfo.Params as IShowTalk;
//         // const items = action.TalkItems;
//         // let currTalkId = 0;
//         // currentFlow.ShowTalkInfo = action;
//         // while (currTalkId < items.length && currentFlow.Runner.IsRunning) {
//         //     if (currTalkId > 0) {
//         //         await delay(csvRegistry.GetCsv(GlobalConfigCsv).GetConfig('TalkShowInterval'));
//         //     }
//         //     const item = items[currTalkId++];
//         //     await this.ShowTalkItem(currentFlow, item);
//         //     if (this.NeedJumpTalk) {
//         //         this.NeedJumpTalk = false;
//         //         currTalkId = this.NextTalkId;
//         //     }
//         // }
//     }

//     // @no-blueprint
//     private ExecuteFinishTalk(actionInfo: IActionInfo): void {
//         // let talkContext: FlowContext = undefined;
//         // for (let i = this.FlowStack.length - 1; i >= 0; i--) {
//         //     const flowContext = this.FlowStack[i];
//         //     flowContext.Runner.Stop();
//         //     if (flowContext.ShowTalkInfo) {
//         //         talkContext = flowContext;
//         //         break;
//         //     }
//         // }

//         // if (!talkContext) {
//         //     error(`${this.Name} FinishTalk failed: no talk flow found`);
//         // }
//     }

//     // @no-blueprint
//     private ExecuteJumpTalk(actionInfo: IActionInfo): void {
//         // let context: FlowContext = undefined;
//         // for (let i = this.FlowStack.length - 1; i >= 0; i--) {
//         //     const flowContext = this.FlowStack[i];
//         //     if (!flowContext.ShowTalkInfo) {
//         //         flowContext.Runner.Stop();
//         //     } else {
//         //         context = flowContext;
//         //         break;
//         //     }
//         // }

//         // if (!context) {
//         //     error(`${this.Name} JumpTalk failed: no talk flow found`);
//         //     return;
//         // }

//         // const action = actionInfo.Params as IJumpTalk;
//         // this.NeedJumpTalk = true;
//         // this.NextTalkId = context.ShowTalkInfo.TalkItems.findIndex((e) => e.Id === action.TalkId);
//     }
// }

// export default TsTalkComponent;
