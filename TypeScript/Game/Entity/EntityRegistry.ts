/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import {
    getBlueprintId,
    getTsClassByUeClass,
    isChildOfClass,
    TTsClassType,
} from '../../Common/Class';
import { error } from '../../Common/Log';
import { stringifyWithOutUnderScore } from '../../Common/Util';
import { IEntityData, ITsEntity, parseComponentsState, TComponentClass } from '../Interface';
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

    public GenData<T extends ITsEntity>(obj: T): IEntityData {
        return {
            PrefabId: getBlueprintId(obj.GetClass()),
            Guid: obj.Guid,
            ComponentsState: parseComponentsState(obj.ComponentsStateJson),
        };
    }

    public ApplyData<T extends ITsEntity>(data: IEntityData, obj: T): void {
        obj.Guid = data.Guid;
        obj.ComponentsStateJson = stringifyWithOutUnderScore(data.ComponentsState);
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
