/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import { BuiltinText, HUD, UMGManager } from 'ue';
import * as UE from 'ue';

import { delay } from '../../Common/Async';

class TsHud extends HUD {
    // @no-blueprint
    private UiTalkerDisplay: UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;

    public ReceiveBeginPlay(): void {
        const classObj = UE.Class.Load('/Game/Demo/UI/UI_TalkDisplayer.UI_TalkDisplayer_C');
        this.UiTalkerDisplay = UMGManager.CreateWidget(
            this.GetWorld(),
            classObj,
        ) as UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;
        this.UiTalkerDisplay.AddToViewport();
    }

    public get TalkerDisplay(): UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C {
        return this.UiTalkerDisplay;
    }

    // @no-blueprint
    public ShowOptions(optionTexts: string[]): void {
        const ueArray = UE.NewArray(BuiltinText);
        optionTexts.forEach((text) => {
            ueArray.Add(text);
        });
        this.UiTalkerDisplay.ShowOptions($ref(ueArray));
    }

    // @no-blueprint
    public async Test(): Promise<void> {
        await delay(2000);
        this.UiTalkerDisplay.ShowSubtile('小明', '今天天气不错');
        await delay(2000);
        this.UiTalkerDisplay.ShowSubtile('小红', '是呀，要出去玩一下吗？');
        await delay(2000);
        this.ShowOptions(['选项1', '选项2']);
        await delay(2000);
        this.UiTalkerDisplay.HideOptions();
        await delay(1000);
        this.ShowOptions(['选项1', '选项2', '选项3']);
        await delay(2000);
        this.UiTalkerDisplay.HideOptions();
        await delay(1000);
        this.ShowOptions(['选项1', '选项2', '选项3', '选项4']);
        await delay(2000);
        this.UiTalkerDisplay.HideAll();
    }
}

export default TsHud;
