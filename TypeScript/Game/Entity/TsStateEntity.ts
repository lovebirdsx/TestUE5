import { ActorStateComponent } from '../Component/ActorStateComponent';
import { CalculateComponent } from '../Component/CalculateComponent';
import { StateComponent } from '../Component/StateComponent';
import { TComponentClass } from '../Interface';
import TsEntity from './TsEntity';

export const stateEntityComponentClasses: TComponentClass[] = [
    StateComponent,
    ActorStateComponent,
    CalculateComponent,
];

class TsStateEntity extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return stateEntityComponentClasses;
    }
}

export default TsStateEntity;
