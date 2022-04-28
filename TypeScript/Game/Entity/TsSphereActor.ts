/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { InterActComponent } from '../Component/InterActComponent';
import { IGameContext, TComponentClass } from '../Interface';
import TsPlayer from '../Player/TsPlayer';
import TsEntity from './TsEntity';

export const sphereComponentClasses: TComponentClass[] = [InterActComponent];

class TsSphereActor extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return sphereComponentClasses;
    }

    // @no-blueprint

    private InterAct: InterActComponent;

    // @no-blueprint
    public Init(context: IGameContext): void {
        super.Init(context);
        this.InterAct = this.Entity.GetComponent(InterActComponent);
    }

    // @no-blueprint
    // eslint-disable-next-line @typescript-eslint/require-await
    public async Interact(player: TsPlayer): Promise<void> {
        this.InterAct.Run();
    }

    public ReceiveActorBeginOverlap(other: Actor): void {
        if (!(other instanceof TsPlayer)) {
            return;
        }
        if (this.InterAct) {
            this.InterAct.ShowInteract();
        }
        other.AddInteractor(this);
    }

    public ReceiveActorEndOverlap(other: Actor): void {
        if (!(other instanceof TsPlayer)) {
            return;
        }
        if (this.InterAct) {
            this.InterAct.CloseInteract();
        }
        other.RemoveInteractor(this);
    }
}

export default TsSphereActor;
