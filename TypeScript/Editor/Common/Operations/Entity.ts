import { EntityTemplateOp } from '../../../Game/Common/Operations/EntityTemplate';
import { SegmentIdGenerator } from '../SegmentIdGenerator';

export class EntityIdGenerator {
    private MyGenerator: SegmentIdGenerator;

    private get Generator(): SegmentIdGenerator {
        if (!this.MyGenerator) {
            this.MyGenerator = new SegmentIdGenerator('entityTemplate');
            if (!this.HasRecord) {
                this.GenRecord(this.MyGenerator);
            }
        }
        return this.MyGenerator;
    }

    private get HasRecord(): boolean {
        return SegmentIdGenerator.HasRecordForConfig('entityTemplate');
    }

    private GetMaxRelatedTemplateId(generator: SegmentIdGenerator): number | undefined {
        // 从当前所有EntityTemplate中查找id最大的Template配置
        let result = -1;
        EntityTemplateOp.Names.forEach((name) => {
            const template = EntityTemplateOp.GetTemplateByName(name);
            if (generator.ContainsId(template.Id) && template.Id > result) {
                result = template.Id;
            }
        });
        return result < 0 ? undefined : result;
    }

    private GenRecord(generator: SegmentIdGenerator): void {
        const entityId = this.GetMaxRelatedTemplateId(generator);
        this.Generator.SaveWithId(entityId !== undefined ? entityId : this.Generator.MinId);
    }

    public GenOne(): number {
        return this.Generator.GenOne();
    }

    public GenMany(count: number): number[] {
        return this.Generator.GenMany(count);
    }
}
