import { error } from '../../../Common/Log';
import { createBooleanScheme, ObjectScheme } from '../../../Common/Type';
import { Component, TComponentClass } from '../../Interface';
import { TActionType } from '../../Interface/Action';

export class ComponentScheme<T> extends ObjectScheme<T> {
    public Actions: TActionType[] = [];

    public NoData?: boolean;
}

export function createComponentScheme<T>(
    type: Partial<ComponentScheme<T>> & Required<Pick<ComponentScheme<T>, 'Actions'>>,
): ComponentScheme<T> {
    if (type?.Fields) {
        const fields = type.Fields as Record<string, unknown>;
        fields.Disabled = createBooleanScheme({
            Hide: true,
            Optional: true,
        });
    }

    const scheme = new ComponentScheme<T>();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}

class ComponentRegistry {
    private readonly ClassMap = new Map<string, TComponentClass>();

    private readonly SchemeMap = new Map<string, ComponentScheme<unknown>>();

    public RegisterClass<TData, T extends Component & TData>(
        classObj: new () => T,
        scheme: ComponentScheme<TData>,
    ): void {
        this.ClassMap.set(classObj.name, classObj);
        this.SchemeMap.set(classObj.name, scheme);
    }

    public HasScheme(type: string): boolean {
        return this.SchemeMap.has(type);
    }

    public HasDataForScheme(type: string): boolean {
        const scheme = this.SchemeMap.get(type);
        return scheme && !scheme.NoData;
    }

    public GetScheme<T>(type: string): ComponentScheme<T> {
        const scheme = this.SchemeMap.get(type);
        if (!scheme) {
            error(`No scheme for component [${type}]`);
            return undefined;
        }
        return scheme as ComponentScheme<T>;
    }

    public TryGetScheme<T>(type: string): ComponentScheme<T> {
        return this.SchemeMap.get(type) as ComponentScheme<T>;
    }
}

export const componentRegistry = new ComponentRegistry();
