import * as React from 'react';

import { ArrayScheme, IProps, ObjectScheme, Scheme } from '../../../Common/Type';
import { IActionInfo } from '../../../Game/Flow/Action';
import { ActionScheme } from '../Scheme/Action/Action';

export type TSchemeComponent<T = unknown, TScheme extends Scheme<T> = Scheme<T>> =
    | React.ComponentClass<IProps<T, TScheme>>
    | React.FunctionComponent<IProps<T, TScheme>>;

class RenderRegistry {
    private readonly RenderClassMap = new Map<Scheme, TSchemeComponent>();

    public RegComponent<T>(schemeClass: Scheme<T>, render: TSchemeComponent<T>): void {
        this.RenderClassMap.set(schemeClass as Scheme, render as TSchemeComponent);
    }

    public RegArrayComponent<TData>(
        scheme: ArrayScheme<TData>,
        render: TSchemeComponent<TData[], ArrayScheme<TData>>,
    ): void {
        this.RegComponent(scheme, render as TSchemeComponent);
    }

    public RegObjComponent<TData>(
        scheme: ObjectScheme<TData>,
        render: TSchemeComponent<TData, ObjectScheme<TData>>,
    ): void {
        this.RegComponent(scheme, render as TSchemeComponent);
    }

    public RegActionComponent(
        scheme: ActionScheme,
        render: TSchemeComponent<IActionInfo, ActionScheme>,
    ): void {
        this.RegComponent(scheme, render as TSchemeComponent);
    }

    public GetComponent<TData, TScheme extends Scheme<TData> = Scheme<TData>>(
        scheme: Scheme,
    ): TSchemeComponent<TData, TScheme> {
        const result = this.RenderClassMap.get(scheme);
        return result as TSchemeComponent<TData, TScheme>;
    }
}

export const renderRegistry = new RenderRegistry();
