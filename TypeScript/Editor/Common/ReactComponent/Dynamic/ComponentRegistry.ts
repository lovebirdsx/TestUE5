import { ComponentClass, FunctionComponent } from 'react';

import { error } from '../../../../Common/Log';
import { IAnyProps, TElementRenderType } from '../../../../Common/Type';

type TComponentClass = ComponentClass<IAnyProps> | FunctionComponent<IAnyProps>;

class ComponentRegistry {
    private readonly ComponentsMap = new Map<TElementRenderType, TComponentClass>();

    public Register(type: TElementRenderType, componentClass: TComponentClass): void {
        if (this.ComponentsMap.get(type)) {
            error(`Register duplicate component [${componentClass}] for ${type}`);
        }

        this.ComponentsMap.set(type, componentClass);
    }

    public Get(type: TElementRenderType): TComponentClass {
        return this.ComponentsMap.get(type);
    }
}

export const componentRegistry = new ComponentRegistry();
