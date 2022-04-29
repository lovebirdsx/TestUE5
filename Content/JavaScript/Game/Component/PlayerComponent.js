"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable spellcheck/spell-checker */
const Log_1 = require("../../Common/Log");
const Interface_1 = require("../Interface");
class PlayerComponent extends Interface_1.Component {
    Interacters = [];
    MyIsInteracting;
    AddInteractor(interacter) {
        const index = this.Interacters.indexOf(interacter);
        if (index >= 0) {
            (0, Log_1.error)(`Add duplicate interacter [${interacter.Name}]`);
            return;
        }
        this.Interacters.push(interacter);
    }
    RemoveInteractor(interacter) {
        const index = this.Interacters.indexOf(interacter);
        if (index < 0) {
            (0, Log_1.error)(`Remove not exist interactor [${interacter.Name}]`);
            return;
        }
        this.Interacters.splice(index, 1);
    }
    get IsInteracting() {
        return this.MyIsInteracting;
    }
    TryInteract() {
        if (this.IsInteracting) {
            return false;
        }
        if (this.Interacters.length <= 0) {
            return false;
        }
        // eslint-disable-next-line no-void
        void this.StartInteract(0);
        return true;
    }
    async StartInteract(id) {
        if (id >= this.Interacters.length) {
            (0, Log_1.error)(`Can not start interact with id [${id} >= ${this.Interacters.length}]`);
            return;
        }
        if (this.IsInteracting) {
            (0, Log_1.error)(`Can not start iteract again`);
            return;
        }
        const interactor = this.Interacters[id];
        this.MyIsInteracting = true;
        await interactor.GetComponent(Interface_1.InteractiveComponent).Interact(this.Entity);
        this.MyIsInteracting = false;
    }
}
exports.default = PlayerComponent;
//# sourceMappingURL=PlayerComponent.js.map