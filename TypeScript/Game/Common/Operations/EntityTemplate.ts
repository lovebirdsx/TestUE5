/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';

import { getFileNameWithOutExt, listFiles } from '../../../Common/File';
import { warn } from '../../../Common/Log';
import { deepEquals, readJsonObj } from '../../../Common/Util';
import { IEntityData, TComponentsData } from '../../Interface';
import { TComponentType } from '../../Interface/Component';
import { GameConfig } from '../GameConfig';

export interface IEntityTemplate {
    Id: number;
    BlueprintId: number;
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

    public static readonly NameById: Map<number, string> = new Map();

    public static readonly IdByName: Map<string, number> = new Map();

    private static readonly IdMap: Map<number, IEntityTemplate> = new Map();

    public static RefreshTemplates(): void {
        this.Names.splice(0);
        this.IdMap.clear();
        this.NameById.clear();
        this.IdByName.clear();

        const files = getEntityTemplateFiles();
        files.forEach((file) => {
            const template = this.Load(file);

            const name = getFileNameWithOutExt(file);
            const id = template.Id;
            this.Names.push(name);

            if (this.IdMap.has(id)) {
                const prevName = this.NameById.get(id);
                throw new Error(`Duplicate template guid [${prevName}] [${name}] guid: ${id}`);
            }

            if (this.IdByName.has(name)) {
                throw new Error(`Duplicate template name [${name}]`);
            }

            this.IdMap.set(id, template);
            this.NameById.set(id, name);
            this.IdByName.set(name, id);
        });
    }

    public static GetTemplateById(id: number): IEntityTemplate {
        return this.IdMap.get(id);
    }

    public static GetTemplateByName(name: string): IEntityTemplate {
        return this.IdMap.get(this.IdByName.get(name));
    }

    public static GetNameById(id: number): string {
        return this.NameById.get(id);
    }

    public static GetIdByName(name: string): number {
        return this.IdByName.get(name);
    }

    public static GetPath(id: number): string {
        const dir = GameConfig.EntityTemplateDir;
        const name = this.GetNameById(id);
        return `${dir}/${name}.json`;
    }

    public static GenDefaultId(): number {
        return this.GetIdByName(this.Names[0]);
    }

    public static Load(path: string): IEntityTemplate {
        return readJsonObj<IEntityTemplate>(path);
    }

    // 将Template中的数据写入EntityData中,如果数据一样,则返回传入的data
    // 否则构造一个新的IEntityData
    public static ProduceEntityData(
        template: IEntityTemplate,
        componentTypes: TComponentType[],
        data: IEntityData,
    ): IEntityData {
        const componentsData = template.ComponentsData;

        // 取模板中共同的Component配置
        const componentsDataNew = Object.assign({}, data.ComponentsData);
        let modifyCount = 0;
        let sameComponentCount = 0;
        for (const key in componentsData) {
            if (componentsDataNew[key] || componentTypes.find((type) => type === key)) {
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

    public static RefreshTemplate(id: number): void {
        const file = this.GetPath(id);
        if (file && this.IdMap.has(id)) {
            const template = this.Load(file);
            this.IdMap.set(id, template);
        }
    }
}

EntityTemplateOp.RefreshTemplates();
