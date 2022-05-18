/* eslint-disable spellcheck/spell-checker */
import { SimpleComponent } from '../Component/SimpleComponent';
import { StateComponent } from '../Component/StateComponent';
import { SpringBoardComponent } from '../Component/TsSpringBoardComponent';
import { TComponentClass } from '../Interface';
import TsEntity from './TsEntity';

export const springBoardComponentClasses: TComponentClass[] = [
    SpringBoardComponent,
    StateComponent,
    SimpleComponent,
];

class TsSpringBoard extends TsEntity {
    // @no-blueprint
    public GetComponentClasses(): TComponentClass[] {
        return springBoardComponentClasses;
    }
}

export default TsSpringBoard;
