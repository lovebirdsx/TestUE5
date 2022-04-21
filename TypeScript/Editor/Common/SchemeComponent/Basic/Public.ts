/* eslint-disable spellcheck/spell-checker */
import { Array } from './Array';
import { Asset, Bool, Enum, Float, Int, String } from './Basic';
import { componentRegistry } from './ComponentRegistry';
import { Dynamic } from './Dynamic';
import { Obj } from './Obj';

function initAllComponents(): void {
    componentRegistry.Register('array', Array);
    componentRegistry.Register('object', Obj);
    componentRegistry.Register('dynamic', Dynamic);
    componentRegistry.Register('boolean', Bool);
    componentRegistry.Register('int', Int);
    componentRegistry.Register('float', Float);
    componentRegistry.Register('string', String);
    componentRegistry.Register('enum', Enum);
    componentRegistry.Register('asset', Asset);
}

initAllComponents();

export * from './Any';
export * from './Array';
export * from './Basic';
export * from './Dynamic';
export * from './Obj';
