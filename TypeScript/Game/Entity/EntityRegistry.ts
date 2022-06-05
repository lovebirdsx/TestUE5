/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor } from 'ue';

import { getTsClassByUeClass, isChildOfClass, TTsClassType } from '../../Common/Class';
import { ITsEntity, TComponentClass } from '../Interface';
import TsPlayer from '../Player/TsPlayer';
import TsCharacterEntity from './TsCharacterEntity';
import TsEntity from './TsEntity';

class EntityRegistry {
    private readonly EntityMap = new Map<TTsClassType, TComponentClass[]>();

    public Register(entityClass: TTsClassType, ...components: TComponentClass[]): void {
        if (this.EntityMap.has(entityClass)) {
            throw new Error(`Register entity again for [${entityClass.name}]`);
        }
        this.EntityMap.set(entityClass, components);
    }

    public GetComponentClassesByTsClass(entityClass: TTsClassType): TComponentClass[] {
        const result = this.EntityMap.get(entityClass);
        if (!result) {
            throw new Error(`No components class for entity [${entityClass.name}]`);
        }
        return result;
    }

    public GetComponentClasses(entity: ITsEntity): TComponentClass[] {
        const tsClassObj = getTsClassByUeClass(entity.GetClass());
        return this.GetComponentClassesByTsClass(tsClassObj);
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
