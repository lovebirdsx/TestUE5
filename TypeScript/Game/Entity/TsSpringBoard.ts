/* eslint-disable spellcheck/spell-checker */
import { StateComponent } from '../Component/StateComponent';
import { SpringBoardComponent } from '../Component/TsSpringBoardComponent';
import { TComponentClass } from '../Interface';
import TsEntity from './TsEntity';

export const springBoardComponentClasses: TComponentClass[] = [
    SpringBoardComponent,
    StateComponent,
];

class TsSpringBoard extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return springBoardComponentClasses;
    }
}

export default TsSpringBoard;
