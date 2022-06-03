/* eslint-disable spellcheck/spell-checker */
import { RefreshEntityComponent } from '../Component/RefreshComponent';
import { StateComponent } from '../Component/StateComponent';
import { TComponentClass } from '../Interface';
import TsEntity from './TsEntity';

export const refreshEntityComponentClasses: TComponentClass[] = [
    RefreshEntityComponent,
    StateComponent,
];

class TsRefreshEntity extends TsEntity {
    public GetComponentClasses(): TComponentClass[] {
        return refreshEntityComponentClasses;
    }
}

export default TsRefreshEntity;
