/* eslint-disable spellcheck/spell-checker */
import { error } from '../../Common/Log';
import { Component, Entity, gameContext, InteractiveComponent } from '../Interface';
import TsHud from '../Player/TsHud';

class PlayerComponent extends Component {
    private readonly Interacters: Entity[] = [];

    private MyIsInteracting: boolean;

    private InteractingActer: Entity;

    public AddInteractor(interacter: Entity): void {
        const index = this.Interacters.indexOf(interacter);
        if (index >= 0) {
            error(`Add duplicate interacter [${interacter.Name}]`);
            return;
        }

        this.Interacters.push(interacter);
    }

    public RemoveInteractor(interacter: Entity): void {
        const index = this.Interacters.indexOf(interacter);
        if (index < 0) {
            error(`Remove not exist interactor [${interacter.Name}]`);
            return;
        }

        this.Interacters.splice(index, 1);
    }

    public get IsInteracting(): boolean {
        return this.MyIsInteracting;
    }

    public TryInteract(): boolean {
        if (this.IsInteracting) {
            return false;
        }

        if (this.Interacters.length === 0) {
            return false;
        }

        let id = 0;
        const tsHud = gameContext.PlayerController.GetHUD() as TsHud;
        const guid = tsHud.GetSelectInteract();
        const tsEntity = gameContext.EntityManager.GetEntity(guid);
        if (tsEntity) {
            id = this.Interacters.indexOf(tsEntity.Entity);
            id = id > 0 ? id : 0;
        }
        // eslint-disable-next-line no-void
        void this.StartInteract(id);
        return true;
    }

    public async StartInteract(id: number): Promise<void> {
        if (id >= this.Interacters.length) {
            error(`Can not start interact with id [${id} >= ${this.Interacters.length}]`);
            return;
        }

        if (this.IsInteracting) {
            return;
        }

        const interactor = this.Interacters[id];
        this.MyIsInteracting = true;
        this.InteractingActer = interactor;
        await interactor.GetComponent(InteractiveComponent).Interact(this.Entity);
        this.InteractingActer = null;
        this.MyIsInteracting = false;
    }
}

export default PlayerComponent;
