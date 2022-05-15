/* eslint-disable spellcheck/spell-checker */
import { EventComponent } from '../Component/EventComponent';
import { LampComponent } from '../Component/LampComponent';
import { StateComponent } from '../Component/StateComponent';
import { TComponentClass } from '../Interface';
import TsEntity from './TsEntity';

export const lampComponentClasses: TComponentClass[] = [
    LampComponent,
    EventComponent,
    StateComponent,
];

class TsLamp extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return lampComponentClasses;
    }
}

export default TsLamp;
