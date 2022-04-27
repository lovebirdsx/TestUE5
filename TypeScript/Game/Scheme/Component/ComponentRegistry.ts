import { Component } from '../../../Common/Entity';
import { error } from '../../../Common/Log';
import { TClassType } from '../../../Common/Type';

type TComponentClass = new () => Component;

class ComponentRegistry {
    private readonly ClassMap = new Map<string, TComponentClass>();

    private readonly SchemeMap = new Map<string, TClassType<unknown>>();

    public RegisterClass(classObj: TComponentClass, scheme: TClassType<unknown>): void {
        this.ClassMap.set(classObj.name, classObj);
        this.SchemeMap.set(classObj.name, scheme);
    }

    public Spawn(type: string): Component {
        const classObj = this.ClassMap.get(type);
        if (!classObj) {
            error(`No component class for [${type}]`);
            return undefined;
        }
        return new classObj();
    }

    public HasScheme(type: string): boolean {
        return this.SchemeMap.has(type);
    }

    public GetScheme(type: string): TClassType<unknown> {
        const scheme = this.SchemeMap.get(type);
        if (!scheme) {
            error(`No scheme for component [${type}]`);
            return undefined;
        }
        return scheme;
    }
}

export const componentRegistry = new ComponentRegistry();
