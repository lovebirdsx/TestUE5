import { Actor } from 'ue';

import { error } from '../../Editor/Common/Log';
import TsPlayer from '../Player/TsPlayer';
import TsEntityComponent from './TsEntityComponent';

type TComponentMap = Map<string, TsEntityComponent>;

class TsEntity extends Actor {
    // @no-blueprint
    private ComponentMap: TComponentMap;

    // @no-blueprint
    private GenComponentMap(): TComponentMap {
        const result = new Map() as TComponentMap;
        for (let i = 0; i < this.BlueprintCreatedComponents.Num(); i++) {
            const c = this.BlueprintCreatedComponents.Get(i);
            if (c instanceof TsEntityComponent) {
                // 此处不能使用c.constructor.name, Puerts中返回为空
                result.set(c.GetName(), c);
            }
        }
        return result;
    }

    // PureTs中 GetComponentByClass不能正确返回TS创建的Component,故而自己写一个更为通用的
    // @no-blueprint
    public GetComponent<T extends TsEntityComponent>(classObj: new () => T): T {
        if (!this.ComponentMap) {
            // ComponentMap不能在Constructor中初始化,因为Constructor中调用时,组件还未创建完毕
            // 也不适合在ReceiveBeginPlay中初始化,这样就必须依赖子类的ReceiveBeginPlay要后调用
            // 此处采用惰性初始化,是最好的做法
            this.ComponentMap = this.GenComponentMap();
        }

        const result = this.ComponentMap.get(classObj.name) as T;
        if (!result) {
            error(`${this.GetName()} can not get component for ${classObj.name}`);
        }
        return result;
    }

    // @no-blueprint
    public async Interact(player: TsPlayer): Promise<void> {
        error(`Interact is not implement for ${this.GetName()}`);
        return Promise.resolve();
    }
}

export default TsEntity;
