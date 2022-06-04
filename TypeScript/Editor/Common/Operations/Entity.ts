import { EditorLevelLibrary } from 'ue';

import { CustomSegmentIdGenerator } from '../SegmentIdGenerator';

export class EntityIdGenerator extends CustomSegmentIdGenerator {
    protected GetMaxIdGenerated(): number {
        return -1;
    }
}

function createCurrentLevelEntityIdGenerator(): EntityIdGenerator {
    const world = EditorLevelLibrary.GetEditorWorld();
    return new EntityIdGenerator(`${world.GetName()}_Entities`);
}

export const currentLevelEntityIdGenerator = createCurrentLevelEntityIdGenerator();
