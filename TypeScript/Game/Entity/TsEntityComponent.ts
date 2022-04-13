import { ActorComponent } from 'ue';

class TsEntityComponent extends ActorComponent {
    public get Name(): string {
        return `${this.GetOwner().GetName()}.${this.GetName()}`;
    }
}

export default TsEntityComponent;
