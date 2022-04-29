import { Actor } from 'ue';

import { isChildOfClass, TTsClassType } from '../../Common/Class';
import { error } from '../../Common/Log';
import { TComponentClass } from '../Interface';
import TsPlayer from '../Player/TsPlayer';
import TsEntity from './TsEntity';

class EntityRegistry {
    private readonly EntityMap = new Map<TTsClassType, TComponentClass[]>();

    public Register(entityClass: TTsClassType, ...components: TComponentClass[]): void {
        this.EntityMap.set(entityClass, components);
    }

    public GetComponents(entityClass: TTsClassType): TComponentClass[] {
        const result = this.EntityMap.get(entityClass);
        if (!result) {
            error(`No components class for [${entityClass.name}]`);
        }
        return result;
    }
}

export function isEntity(actor: Actor): boolean {
    return isChildOfClass(actor, TsEntity) || isChildOfClass(actor, TsPlayer);
}

export const entityRegistry = new EntityRegistry();
