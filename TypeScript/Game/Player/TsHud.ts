/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import { BuiltinText, HUD, UMGManager } from 'ue';
import * as UE from 'ue';

import { delay, TCallback, waitCallback } from '../../Common/Async';
import { log } from '../../Editor/Common/Log';

class TsHud extends HUD {
    // @no-blueprint
    private UiTalkerDisplay: UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;

    public Constructor(): void {
        const classObj = UE.Class.Load('/Game/Demo/UI/UI_TalkDisplayer.UI_TalkDisplayer_C');
        this.UiTalkerDisplay = UMGManager.CreateWidget(
            this.GetWorld(),
            classObj,
        ) as UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;
    }

    public ReceiveBeginPlay(): void {
        this.UiTalkerDisplay.AddToViewport();
        // void this.Test();
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
        await delay(1000);
        this.UiTalkerDisplay.ShowSubtile('小明', '今天天气不错');
        await delay(1000);
        this.UiTalkerDisplay.ShowSubtile('小红', '是呀，要出去玩一下吗？');

        let resolve: TCallback<string> = undefined;
        let optionText: string = undefined;

        await delay(1000);
        this.ShowOptions(['选项1', '选项2']);
        this.UiTalkerDisplay.OptionSelected.Clear();
        this.UiTalkerDisplay.OptionSelected.Add((text) => {
            resolve(text);
            optionText = text;
        });
        await waitCallback<string>((resolve0): void => {
            resolve = resolve0;
        });
        log(`你选择了[${optionText}]`);
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
