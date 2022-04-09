"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-magic-numbers */
const ue_1 = require("ue");
class TsPlayerController extends ue_1.PlayerController {
    ReceiveBeginPlay() {
        this.MyPlayer = ue_1.GameplayStatics.GetPlayerCharacter(this.GetWorld(), 0);
    }
    SpeedUp() {
        this.MyPlayer.Speed = this.MyPlayer.Speed * 1.5;
    }
    SpeedDown() {
        this.MyPlayer.Speed = this.MyPlayer.Speed * 0.75;
    }
    ResetSpeed() {
        this.MyPlayer.ResetSpeed();
    }
}
exports.default = TsPlayerController;
//# sourceMappingURL=TsPlayerController.js.map