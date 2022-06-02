/* eslint-disable spellcheck/spell-checker */
import { warn } from '../../../Common/Log';
import { genGuid, readJsonObj, writeJson } from '../../../Common/Util';
import { EntityTemplateOp, IEntityTemplate } from '../../../Game/Common/Operations/EntityTemplate';
import { IEntityData } from '../../../Game/Interface';
import { LevelTools } from '../../EntityEditor/LevelTools';
import { SegmentIdGenerator } from '../SegmentIdGenerator';

export class TemplateIdGenerator {
    private static MyGenerator: SegmentIdGenerator;

    private static get Generator(): SegmentIdGenerator {
        if (!this.MyGenerator) {
            this.MyGenerator = new SegmentIdGenerator('entityTemplate');
            if (!this.HasRecord) {
                this.GenRecord(this.MyGenerator);
            }
        }
        return this.MyGenerator;
    }

    private static get HasRecord(): boolean {
        return SegmentIdGenerator.HasRecordForConfig('entityTemplate');
    }

    private static GetMaxRelatedTemplateId(generator: SegmentIdGenerator): number | undefined {
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

    private static GenRecord(generator: SegmentIdGenerator): void {
        const entityId = this.GetMaxRelatedTemplateId(generator);
        this.Generator.SaveWithId(entityId !== undefined ? entityId : this.Generator.MinId);
    }

    public static GenOne(): number {
        return this.Generator.GenOne();
    }

    public static GenMany(count: number): number[] {
        return this.Generator.GenMany(count);
    }
}

export class EditorEntityTemplateOp {
    public static Gen(data: IEntityData, guid?: string): IEntityTemplate {
        return {
            Guid: guid || genGuid(),
            Id: TemplateIdGenerator.GenOne(),
            PrefabId: data.PrefabId,
            ComponentsData: data.ComponentsData,
        };
    }

    public static Save(data: IEntityData, path: string): void {
        const existTemplate = EntityTemplateOp.Load(path);
        const template = this.Gen(data, existTemplate ? existTemplate.Guid : undefined);
        writeJson(template, path, true);
    }

    public static FixAllTemplateId(): void {
        const templateFiles = LevelTools.GetAllEntityTemplatePath();
        let fixCount = 0;
        templateFiles.forEach((templateFile) => {
            const template = readJsonObj<IEntityTemplate>(templateFile);
            if (template.Id === undefined) {
                template.Id = TemplateIdGenerator.GenOne();
                writeJson(template, templateFile, true);
                warn(`Fix template id [${template.Id}]: ${templateFile}`);
                fixCount++;
            }
        });
        warn(`Fix ${fixCount} template`);
    }
}
