import { ActorComponent } from 'ue';

// import TsEntity from './TsEntity';

class TsEntityComponent extends ActorComponent {
    public get Name(): string {
        return `${this.GetOwner().GetName()}.${this.GetName()}`;
    }

    // public get Entity(): TsEntity {
    //     return this.GetOwner() as TsEntity;
    // }

    // @no-blueprint
    // public GetComponent<T extends TsEntityComponent>(classObj: new () => T): T {
    //     return this.Entity.GetComponent<T>(classObj);
    // }
}

export default TsEntityComponent;
