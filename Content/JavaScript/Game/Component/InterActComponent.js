"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterActComponent = void 0;
const Log_1 = require("../../Common/Log");
const Interface_1 = require("../Interface");
var EBtnState;
(function (EBtnState) {
    EBtnState[EBtnState["Up"] = 1] = "Up";
    EBtnState[EBtnState["Down"] = 2] = "Down";
})(EBtnState || (EBtnState = {}));
class InterActComponent extends Interface_1.Component {
    InteractDisplay;
    BtnState;
    OnInit() {
        const playerController = this.Context.PlayerController;
        const tsHud = playerController.GetHUD();
        this.ChangeState(EBtnState.Down);
        this.InteractDisplay = tsHud.InteractDisplay;
        this.InteractDisplay.HideAll();
    }
    ShowInteract() {
        this.InteractDisplay.ShowAll();
        (0, Log_1.log)(`ShowInteractShowInteractShowInteract`);
    }
    CloseInteract() {
        this.InteractDisplay.HideAll();
        (0, Log_1.log)(`CloseInteractCloseInteractCloseInteract`);
    }
    Run() {
        this.ChangeState();
    }
    ChangeState(state) {
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
exports.InterActComponent = InterActComponent;
//# sourceMappingURL=InterActComponent.js.map