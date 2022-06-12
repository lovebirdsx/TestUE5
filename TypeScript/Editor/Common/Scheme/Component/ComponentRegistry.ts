import { error } from '../../../../Common/Log';
import { TComponentType } from '../../../../Game/Interface/IComponent';
import { createBooleanScheme, ObjectScheme } from '../../Type';

export class ComponentScheme<T> extends ObjectScheme<T> {}

export function createComponentScheme<T>(type: Partial<ComponentScheme<T>>): ComponentScheme<T> {
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
    private readonly SchemeMap = new Map<TComponentType, ComponentScheme<unknown>>();

    public RegisterClass(type: TComponentType, scheme: ComponentScheme<unknown>): void {
        this.SchemeMap.set(type, scheme);
    }

    public HasScheme(type: TComponentType): boolean {
        return this.SchemeMap.has(type);
    }

    public GetScheme<T>(type: TComponentType): ComponentScheme<T> {
        const scheme = this.SchemeMap.get(type);
        if (!scheme) {
            error(`No scheme for component [${type}]`);
            return undefined;
        }
        return scheme as ComponentScheme<T>;
    }

    public TryGetScheme<T>(type: TComponentType): ComponentScheme<T> {
        return this.SchemeMap.get(type) as ComponentScheme<T>;
    }
}

export const componentRegistry = new ComponentRegistry();
