/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-await-in-loop */
/* eslint-disable spellcheck/spell-checker */
import * as UE from 'ue';

import { Component } from '../../Common/Entity';
import { log } from '../../Common/Log';
import TsHud from '../Player/TsHud';
import TsPlayerController from '../Player/TsPlayerController';

enum EBtnState {
    Up = 1,
    Down = 2,
}

export class InterActComponent extends Component {
    private InteractDisplay: UE.Game.Demo.UI.UI_Interact.UI_Interact_C;

    private BtnState: number;

    public OnInit(): void {
        const playerController = TsPlayerController.Instance;
        const tsHud = playerController.GetHUD() as TsHud;
        this.ChangeState(EBtnState.Down);
        this.InteractDisplay = tsHud.InteractDisplay;
        this.InteractDisplay.HideAll();
    }

    public ShowInteract(): void {
        this.InteractDisplay.ShowAll();
        log(`ShowInteractShowInteractShowInteract`);
    }

    public CloseInteract(): void {
        this.InteractDisplay.HideAll();
        log(`CloseInteractCloseInteractCloseInteract`);
    }

    public Run(): void {
        this.ChangeState();
    }

    public ChangeState(state?: number): void {
        if (state) {
            this.BtnState = state;
        }
        switch (this.BtnState) {
            case EBtnState.Up:
                this.InteractDisplay.SetBtnTitle(`放下`);
                this.BtnState = EBtnState.Down;
                break;
            case EBtnState.Down:
                this.InteractDisplay.SetBtnTitle(`抬起`);
                this.BtnState = EBtnState.Up;
                break;
        }
    }
}
