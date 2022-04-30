/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { getTsClassByUeClass, isChildOfClass, TTsClassType } from '../../Common/Class';
import { error } from '../../Common/Log';
import { stringifyWithOutUnderScore } from '../../Common/Util';
import { ITsEntity, TComponentClass, TComponentsState, TEntityPureData } from '../Interface';
import TsPlayer from '../Player/TsPlayer';
import TsCharacterEntity from './TsCharacterEntity';
import TsEntity from './TsEntity';

class EntityRegistry {
    private readonly EntityMap = new Map<TTsClassType, TComponentClass[]>();

    public Register(entityClass: TTsClassType, ...components: TComponentClass[]): void {
        this.EntityMap.set(entityClass, components);
    }

    public GetComponentClassesByTsClass(entityClass: TTsClassType): TComponentClass[] {
        const result = this.EntityMap.get(entityClass);
        if (!result) {
            error(`No components class for [${entityClass.name}]`);
        }
        return result;
    }

    public GetComponentClassesByActor(actor: Actor): TComponentClass[] {
        const tsClassObj = getTsClassByUeClass(actor.GetClass());
        return this.GetComponentClassesByTsClass(tsClassObj);
    }

    public GenData<T extends ITsEntity>(obj: T): TEntityPureData {
        const result: TEntityPureData = {
            // 转换为Object,方便查看序列化之后的字符串
            ComponentsStateJson: obj.ComponentsStateJson
                ? (JSON.parse(obj.ComponentsStateJson) as TComponentsState)
                : {},
            Guid: obj.Guid,
        };

        return result;
    }

    public ApplyData<T extends ITsEntity>(pureData: TEntityPureData, obj: T): void {
        obj.Guid = pureData.Guid;

        // pureData中存储的是对象,所以要转换一次
        obj.ComponentsStateJson = stringifyWithOutUnderScore(pureData.ComponentsStateJson);
    }
}

export function isEntity(actor: Actor): boolean {
    return (
        isChildOfClass(actor, TsEntity) ||
        isChildOfClass(actor, TsCharacterEntity) ||
        isChildOfClass(actor, TsPlayer)
    );
}

export function isPlayer(actor: Actor): boolean {
    return isChildOfClass(actor, TsPlayer);
}

export const entityRegistry = new EntityRegistry();
