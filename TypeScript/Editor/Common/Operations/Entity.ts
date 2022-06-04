import { CustomSegmentIdGenerator } from '../SegmentIdGenerator';

export class EntityIdGenerator extends CustomSegmentIdGenerator {
    protected GetMaxIdGenerated(): number {
        return -1;
    }
}
