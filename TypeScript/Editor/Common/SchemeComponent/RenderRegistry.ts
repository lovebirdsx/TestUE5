import * as React from 'react';

import { ArrayScheme, IProps, ObjectScheme, Scheme, TSchemeClass } from '../../../Common/Type';
import { IActionInfo } from '../../../Game/Flow/Action';
import { ActionScheme } from '../Scheme/Action/Action';

export type TSchemeComponent<T = unknown, TScheme extends Scheme<T> = Scheme<T>> =
    | React.ComponentClass<IProps<T, TScheme>>
    | React.FunctionComponent<IProps<T, TScheme>>;

class RenderRegistry {
    private readonly RenderClassMap = new Map<TSchemeClass, TSchemeComponent>();

    public RegComponent<T>(schemeClass: TSchemeClass<T>, render: TSchemeComponent<T>): void {
        this.RenderClassMap.set(schemeClass as TSchemeClass, render as TSchemeComponent);
    }

    public RegArrayComponent<TData>(
        schemeClass: new () => ArrayScheme<TData>,
        render: TSchemeComponent<TData[], ArrayScheme<TData>>,
    ): void {
        this.RegComponent(schemeClass as TSchemeClass<undefined[]>, render as TSchemeComponent);
    }

    public RegObjComponent<TData>(
        schemeClass: new () => ObjectScheme<TData>,
        render: TSchemeComponent<TData, ObjectScheme<TData>>,
    ): void {
        this.RegComponent(schemeClass as TSchemeClass, render as TSchemeComponent);
    }

    public RegActionComponent(
        schemeClass: new () => ActionScheme,
        render: TSchemeComponent<IActionInfo, ActionScheme>,
    ): void {
        this.RegComponent(schemeClass, render as TSchemeComponent);
    }

    public GetComponent<TData, TScheme extends Scheme<TData> = Scheme<TData>>(
        schemeClass: new () => TScheme,
    ): TSchemeComponent<TData, TScheme> {
        const result = this.RenderClassMap.get(schemeClass as TSchemeClass);
        return result as TSchemeComponent<TData, TScheme>;
    }
}

export const renderRegistry = new RenderRegistry();
