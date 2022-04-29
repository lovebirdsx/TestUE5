"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-magic-numbers */
const ue_1 = require("ue");
const PlayerComponent_1 = require("../Component/PlayerComponent");
class TsPlayerController extends ue_1.PlayerController {
    MyPlayer;
    // @no-blueprint
    Context;
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
    Interact() {
        this.MyPlayer.Entity.GetComponent(PlayerComponent_1.default).TryInteract();
    }
    Load() {
        this.Context.EntityManager.Load();
    }
    Save() {
        this.Context.EntityManager.Save();
    }
}
exports.default = TsPlayerController;
//# sourceMappingURL=TsPlayerController.js.map