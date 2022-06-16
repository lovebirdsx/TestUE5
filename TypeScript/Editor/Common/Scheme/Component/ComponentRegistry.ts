import { getComponentsTypeByEntityType } from '../../../../Common/Interface/Entity';
import { TComponentType } from '../../../../Common/Interface/IComponent';
import { TComponentData, TComponentsData, TEntityType } from '../../../../Common/Interface/IEntity';
import { error, warn } from '../../../../Common/Misc/Log';
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

    public FixComponentsData(entityType: TEntityType, componentsData: TComponentsData): number {
        const componentTypes = getComponentsTypeByEntityType(entityType);

        let fixCount = 0;
        // 移除不存在的Component配置
        Object.keys(componentsData).forEach((key) => {
            const componentType = key as TComponentType;
            const isExist = componentTypes.find((type) => type === componentType) !== undefined;
            if (!isExist || !this.HasScheme(componentType)) {
                warn(`移除不存在的Component配置[${componentType}]`);
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete componentsData[componentType];
                fixCount++;
            }
        });

        // 填充需要的Component配置
        componentTypes.forEach((componentType) => {
            if (this.HasScheme(componentType)) {
                // 存在则尝试修复, 否则构造一个新的ComponentData
                const scheme = this.GetScheme(componentType);
                if (componentsData[componentType]) {
                    if (scheme.Fix(componentsData[componentType]) === 'fixed') {
                        fixCount++;
                        warn(`修复Component[${componentType}]`);
                    }
                } else {
                    const componentData = scheme.CreateDefault() as TComponentData;
                    componentsData[componentType] = componentData;
                    fixCount++;
                    warn(`添加缺失的Component[${componentType}]`);
                }
            }
        });
        return fixCount;
    }
}

export const componentRegistry = new ComponentRegistry();
