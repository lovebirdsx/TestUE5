/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { EditorLevelLibrary } from 'ue';

import { LevelTools } from '../../EntityEditor/LevelTools';
import { CustomSegmentIdGenerator } from '../SegmentIdGenerator';

export class EntityIdGenerator extends CustomSegmentIdGenerator {
    protected GetMaxIdGenerated(): number {
        const entityDatas = LevelTools.GetAllEntityDataOfCurrentLevel();
        let result = -1;
        entityDatas.forEach((ed) => {
            if (this.ContainsId(ed.Id) && ed.Id > result) {
                result = ed.Id;
            }
        });
        return result;
    }
}

function createCurrentLevelEntityIdGenerator(): EntityIdGenerator {
    const world = EditorLevelLibrary.GetEditorWorld();
    return new EntityIdGenerator(`${world.GetName()}_Entities`);
}

export const currentLevelEntityIdGenerator = createCurrentLevelEntityIdGenerator();
