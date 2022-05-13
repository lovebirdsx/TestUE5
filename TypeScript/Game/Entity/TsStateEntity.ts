import { ActionRunnerComponent } from '../Component/ActionRunnerComponent';
import ActorStateComponent from '../Component/ActorStateComponent';
import StateComponent from '../Component/StateComponent';
import { TComponentClass } from '../Interface';
import TsEntity from './TsEntity';

export const stateEntityComponentClasses: TComponentClass[] = [
    ActionRunnerComponent,
    StateComponent,
    ActorStateComponent,
];

class TsStateEntity extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return stateEntityComponentClasses;
    }
}

export default TsStateEntity;