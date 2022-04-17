/* eslint-disable spellcheck/spell-checker */
import { Actor, edit_on_instance } from 'ue';

import { getTsClassByUeClass } from '../../Common/Class';
import { Entity } from '../../Common/Entity';
import { error } from '../../Common/Log';
import { entityRegistry } from './EntityRegistry';
import { ITsEntity, ITsPlayer, parseComponentsState } from './Interface';
// import TsEntityComponent from './TsEntityComponent';

// type TComponentMap = Map<string, TsEntityComponent>;

class TsEntity extends Actor implements ITsEntity {
    @edit_on_instance()
    public ComponentsStateJson: string;

    // @no-blueprint
    // private ComponentMap: TComponentMap;

    // @no-blueprint
    public Entity: Entity;

    public get Name(): string {
        return this.GetName();
    }

    // @no-blueprint
    // private GenComponentMap(): TComponentMap {
    //     const result = new Map() as TComponentMap;
    //     for (let i = 0; i < this.BlueprintCreatedComponents.Num(); i++) {
    //         const c = this.BlueprintCreatedComponents.Get(i);
    //         if (c instanceof TsEntityComponent) {
    //             // 此处不能使用c.constructor.name, Puerts中返回为空
    //             result.set(c.GetName(), c);
    //         }
    //     }
    //     return result;
    // }

    private GenEntity(): Entity {
        const entity = new Entity(this.GetOwner().GetName());
        const componentsState = parseComponentsState(this.ComponentsStateJson);
        const tsClass = getTsClassByUeClass(this.GetClass());
        const componentClasses = entityRegistry.GetComponents(tsClass);
        componentClasses.forEach((componentClass) => {
            const component = entity.AddComponentC(componentClass);
            const data = componentsState.Components[componentClass.name];
            if (data) {
                Object.assign(component, data);
            }
        });
        return entity;
    }

    // PureTs中 GetComponentByClass不能正确返回TS创建的Component,故而自己写一个更为通用的
    // @no-blueprint
    // public GetComponent<T extends TsEntityComponent>(classObj: new () => T): T {
    //     if (!this.ComponentMap) {
    //         // ComponentMap不能在Constructor中初始化,因为Constructor中调用时,组件还未创建完毕
    //         // 也不适合在ReceiveBeginPlay中初始化,这样就必须依赖子类的ReceiveBeginPlay要后调用
    //         // 此处采用惰性初始化,是最好的做法
    //         this.ComponentMap = this.GenComponentMap();
    //     }

    //     const result = this.ComponentMap.get(classObj.name) as T;
    //     if (!result) {
    //         error(`${this.GetName()} can not get component for ${classObj.name}`);
    //     }
    //     return result;
    // }

    // @no-blueprint
    public async Interact(player: ITsPlayer): Promise<void> {
        error(`Interact is not implement for ${this.GetName()}`);
        return Promise.resolve();
    }
}

export default TsEntity;
