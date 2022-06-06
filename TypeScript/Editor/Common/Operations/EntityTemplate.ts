/* eslint-disable spellcheck/spell-checker */
import { warn } from '../../../Common/Log';
import { readJsonObj, writeJson } from '../../../Common/Util';
import { EntityTemplateOp, IEntityTemplate } from '../../../Game/Common/Operations/EntityTemplate';
import { IEntityData } from '../../../Game/Interface';
import { LevelTools } from '../../EntityEditor/LevelTools';
import { CustomSegmentIdGenerator } from '../SegmentIdGenerator';

class TemplateIdGenerator extends CustomSegmentIdGenerator {
    protected GetMaxIdGenerated(): number {
        let result = -1;
        EntityTemplateOp.Names.forEach((name) => {
            const template = EntityTemplateOp.GetTemplateByName(name);
            if (this.ContainsId(template.Id) && template.Id > result) {
                result = template.Id;
            }
        });
        return result;
    }
}

export const templateIdGenerator = new TemplateIdGenerator('entityTemplate');

export class EditorEntityTemplateOp {
    public static Gen(data: IEntityData, id?: number): IEntityTemplate {
        return {
            Id: id || templateIdGenerator.GenOne(),
            BlueprintId: data.BlueprintId,
            ComponentsData: data.ComponentsData,
        };
    }

    public static Save(data: IEntityData, path: string): void {
        const existTemplate = EntityTemplateOp.Load(path);
        const template = this.Gen(data, existTemplate ? existTemplate.Id : undefined);
        writeJson(template, path, true);
    }

    public static FixAllTemplateId(): void {
        const templateFiles = LevelTools.GetAllEntityTemplatePath();
        let fixCount = 0;
        templateFiles.forEach((templateFile) => {
            const template = readJsonObj<IEntityTemplate>(templateFile);
            if (template.Id === undefined) {
                template.Id = templateIdGenerator.GenOne();
                writeJson(template, templateFile, true);
                warn(`Fix template id [${template.Id}]: ${templateFile}`);
                fixCount++;
            }
        });
        warn(`Fix ${fixCount} template`);
    }
}
