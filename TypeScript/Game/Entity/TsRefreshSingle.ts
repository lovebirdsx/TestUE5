/* eslint-disable spellcheck/spell-checker */
import { EntitySpawnerComponent } from '../Component/EntitySpawnerComponent';
import { RefreshSingleComponent } from '../Component/RefreshComponent';
import { StateComponent } from '../Component/StateComponent';
import { TComponentClass } from '../Interface';
import TsEntity from './TsEntity';

export const refreshSingleComponentClasses: TComponentClass[] = [
    RefreshSingleComponent,
    StateComponent,
    EntitySpawnerComponent,
];

class TsRefreshSingle extends TsEntity {
    public GetComponentClasses(): TComponentClass[] {
        return refreshSingleComponentClasses;
    }
}

export default TsRefreshSingle;
