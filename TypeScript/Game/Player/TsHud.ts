/* eslint-disable no-void */
/* eslint-disable spellcheck/spell-checker */
import { $ref, $unref } from 'puerts';
import { BuiltinText, HUD, UMGManager } from 'ue';
import * as UE from 'ue';

import { createSignal, delay } from '../../Common/Misc/Async';
import { log } from '../../Common/Misc/Log';

class TsHud extends HUD {
    // @no-blueprint
    private UiTalkerDisplay: UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;

    // @no-blueprint
    private UiInteractDisplay: UE.Game.Demo.UI.UI_Interact.UI_Interact_C;

    private Interacts: number[];

    public Constructor(): void {
        const classObj = UE.Class.Load('/Game/Demo/UI/UI_TalkDisplayer.UI_TalkDisplayer_C');
        this.UiTalkerDisplay = UMGManager.CreateWidget(
            this.GetWorld(),
            classObj,
        ) as UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C;

        const interactObj = UE.Class.Load('/Game/Demo/UI/UI_Interact.UI_Interact_C');
        this.UiInteractDisplay = UMGManager.CreateWidget(
            this.GetWorld(),
            interactObj,
        ) as UE.Game.Demo.UI.UI_Interact.UI_Interact_C;

        this.Interacts = [];
    }

    public ReceiveBeginPlay(): void {
        this.UiTalkerDisplay.AddToViewport();
        this.UiInteractDisplay.AddToViewport();
        // void this.Test();
    }

    public get TalkerDisplay(): UE.Game.Demo.UI.UI_TalkDisplayer.UI_TalkDisplayer_C {
        return this.UiTalkerDisplay;
    }

    public get InteractDisplay(): UE.Game.Demo.UI.UI_Interact.UI_Interact_C {
        return this.UiInteractDisplay;
    }

    public AddInteract(key: string, id: number): void {
        const index = this.Interacts.indexOf(id);
        if (index < 0) {
            this.Interacts.push(id);
            this.UiInteractDisplay.AddItem(key, id.toString());
        }
    }

    public DelInteract(id: number): void {
        const index = this.Interacts.indexOf(id);
        if (index >= 0) {
            this.Interacts.splice(index, 1);
            this.UiInteractDisplay.DelItem(index);
        }
    }

    public GetSelectInteract(): number {
        const idStrRef = $ref('');
        this.UiInteractDisplay.GetSelect(idStrRef);
        const idStr = $unref(idStrRef);
        return parseInt(idStr, 10);
    }

    public ShowInteract(): void {
        this.UiInteractDisplay.SetActive(true);
    }

    public HideInteract(): void {
        this.UiInteractDisplay.SetActive(false);
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
        await delay(1);
        this.UiTalkerDisplay.ShowSubtile('小明', '今天天气不错');
        await delay(1);
        this.UiTalkerDisplay.ShowSubtile('小红', '是呀，要出去玩一下吗？');

        await delay(1);
        this.ShowOptions(['选项1', '选项2']);

        const selectSignal = createSignal<string>();
        this.UiTalkerDisplay.OptionSelected.Clear();
        this.UiTalkerDisplay.OptionSelected.Add((text) => {
            selectSignal.Emit(text);
        });

        const optionText = await selectSignal.Promise;
        log(`你选择了[${optionText}]`);
        this.UiTalkerDisplay.HideOptions();
        await delay(1);

        this.ShowOptions(['选项1', '选项2', '选项3']);
        await delay(2);
        this.UiTalkerDisplay.HideOptions();

        await delay(1);
        this.ShowOptions(['选项1', '选项2', '选项3', '选项4']);
        await delay(2);
        this.UiTalkerDisplay.HideAll();
    }
}

export default TsHud;
