/* eslint-disable spellcheck/spell-checker */
import { ActorStateComponent } from '../Component/ActorStateComponent';
import { CalculateComponent } from '../Component/CalculateComponent';
import { EntitySpawnerComponent } from '../Component/EntitySpawnerComponent';
import { StateComponent } from '../Component/StateComponent';
import { TComponentClass } from '../Interface';
import TsEntity from './TsEntity';

export const stateEntityComponentClasses: TComponentClass[] = [
    StateComponent,
    ActorStateComponent,
    CalculateComponent,
    EntitySpawnerComponent,
];

class TsStateEntity extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return stateEntityComponentClasses;
    }
}

export default TsStateEntity;
