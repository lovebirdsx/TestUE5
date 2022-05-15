/* eslint-disable spellcheck/spell-checker */
import { SimpleComponent } from '../Component/SimpleComponent';
import { TComponentClass } from '../Interface';
import TsEntity from './TsEntity';

export const simpleComponentClasses: TComponentClass[] = [SimpleComponent];

class TsSimple extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return simpleComponentClasses;
    }
}

export default TsSimple;
