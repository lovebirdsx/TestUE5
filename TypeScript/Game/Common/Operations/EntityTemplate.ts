/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';

import { getFileNameWithOutExt, listFiles } from '../../../Common/File';
import { warn } from '../../../Common/Log';
import { deepEquals, genGuid, readJsonObj } from '../../../Common/Util';
import { IEntityData, TComponentClass, TComponentsData } from '../../Interface';
import { GameConfig } from '../GameConfig';

export interface IEntityTemplate {
    Guid: string;
    Id: number;
    PrefabId: number;
    ComponentsData: TComponentsData;
}

function getEntityTemplateFiles(): string[] {
    const files = listFiles(GameConfig.EntityTemplateDir, 'json', true);
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    files.sort();
    return files;
}

export class EntityTemplateOp {
    public static readonly Names: string[] = [];

    public static readonly NameByGuid: Map<string, string> = new Map();

    public static readonly GuidByName: Map<string, string> = new Map();

    private static readonly GuidMap: Map<string, IEntityTemplate> = new Map();

    public static RefreshTemplates(): void {
        this.Names.splice(0);
        this.GuidMap.clear();
        this.NameByGuid.clear();
        this.GuidByName.clear();

        const files = getEntityTemplateFiles();
        files.forEach((file) => {
            const template = this.Load(file);

            const name = getFileNameWithOutExt(file);
            const guid = template.Guid;
            this.Names.push(name);

            if (this.GuidMap.has(guid)) {
                const prevName = this.NameByGuid.get(guid);
                throw new Error(`Duplicate template guid [${prevName}] [${name}] guid: ${guid}`);
            }

            if (this.GuidByName.has(name)) {
                throw new Error(`Duplicate template name [${name}]`);
            }

            this.GuidMap.set(guid, template);
            this.NameByGuid.set(guid, name);
            this.GuidByName.set(name, guid);
        });
    }

    public static GetTemplateByGuid(guid: string): IEntityTemplate {
        return this.GuidMap.get(guid);
    }

    public static GetTemplateByName(name: string): IEntityTemplate {
        return this.GuidMap.get(this.GuidByName.get(name));
    }

    public static GenEntityData(templateGuid: string, entityGuid?: string): IEntityData {
        const template = this.GetTemplateByGuid(templateGuid);
        return {
            Guid: entityGuid || genGuid(),
            ComponentsData: template.ComponentsData,
            PrefabId: template.PrefabId,
        };
    }

    public static GetNameByGuid(guid: string): string {
        return this.NameByGuid.get(guid);
    }

    public static GetGuidByName(name: string): string {
        return this.GuidByName.get(name);
    }

    public static GetPath(guid: string): string {
        const dir = GameConfig.EntityTemplateDir;
        const name = this.GetNameByGuid(guid);
        return `${dir}/${name}.json`;
    }

    public static GenDefaultGuid(): string {
        return this.GetGuidByName(this.Names[0]);
    }

    public static Load(path: string): IEntityTemplate {
        return readJsonObj<IEntityTemplate>(path);
    }

    // 将Template中的数据写入EntityData中,如果数据一样,则返回传入的data
    // 否则构造一个新的IEntityData
    public static ProduceEntityData(
        template: IEntityTemplate,
        componentClasses: TComponentClass[],
        data: IEntityData,
    ): IEntityData {
        const componentsData = template.ComponentsData;

        // 取模板中共同的Component配置
        const componentsDataNew = Object.assign({}, data.ComponentsData);
        let modifyCount = 0;
        let sameComponentCount = 0;
        for (const key in componentsData) {
            if (componentsDataNew[key] || componentClasses.find((c) => c.name === key)) {
                sameComponentCount++;
                if (!deepEquals(componentsDataNew[key], componentsData[key])) {
                    componentsDataNew[key] = componentsData[key];
                    modifyCount++;
                }
            }
        }

        if (sameComponentCount <= 0) {
            warn(`模板中不存在当前实体相关的组件配置`);
            return data;
        }

        if (modifyCount <= 0) {
            warn(`模板配置和当前实体配置内容相同`);
            return data;
        }

        const newData = produce(data, (draft) => {
            draft.ComponentsData = componentsDataNew;
        });
        return newData;
    }
}

EntityTemplateOp.RefreshTemplates();
