/* eslint-disable spellcheck/spell-checker */
import { Blueprint } from 'ue';

import { IExtendedEntityRow } from '../../../../Common/CsvConfig/ExtendedEntityCsv';
import { getEntityTypeByBlueprintType } from '../../../../Common/Interface/Entity';
import { entityTypeConfig } from '../../../../Common/Interface/IEntity';
import { entityTemplateManager } from '../../EntityTemplateManager';
import { EditorGlobalCsv } from './Common';

export class EditorExtendedEntityCsv extends EditorGlobalCsv<IExtendedEntityRow> {
    private IsBaseEntityType(type: string): boolean {
        return entityTypeConfig[type] !== undefined;
    }

    private IsValidBp(path: string): boolean {
        const bp = Blueprint.Load(path);
        return bp !== undefined;
    }

    public Check(messages: string[]): number {
        let errorCount = 0;
        this.Rows.forEach((row) => {
            if (!this.IsValidBp(row.Bp)) {
                messages.push(`Entity Id [${row.Id}] 蓝图不存在`);
                errorCount++;
            } else if (this.IsBaseEntityType(row.Id)) {
                messages.push(`Entity Id [${row.Id}] 非法, 已经被基础实体占用`);
                errorCount++;
            } else if (!entityTemplateManager.IsSameEntityType(row.Id, row.TemplateId)) {
                const tp1 = getEntityTypeByBlueprintType(row.Id);
                const tp2 = entityTemplateManager.GetEntityType(row.TemplateId);
                messages.push(`Entity Id [${row.Id}] 蓝图实体类型[${tp1}] != 模板实体类型[${tp2}]`);
                errorCount++;
            }
        });
        return errorCount;
    }
}
