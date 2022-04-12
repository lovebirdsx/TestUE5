import { Actor, ActorComponent } from 'ue';

class TsEntity extends Actor {
    // PureTs中 GetComponentByClass不能正确返回TS创建的Component,故而自己写一个更为通用的
    // @no-blueprint
    public GetComponentByTsClass<T extends ActorComponent>(classObj: new () => T): T | undefined {
        for (let i = 0; i < this.BlueprintCreatedComponents.Num(); i++) {
            const c = this.BlueprintCreatedComponents.Get(i);
            if (c instanceof classObj) {
                return c;
            }
        }

        return undefined;
    }
}

export default TsEntity;