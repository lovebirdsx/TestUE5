/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import { $ref } from 'puerts';
import { BuiltinString, MyFileHelper, NewArray } from 'ue';

import { getFileNameWithOutExt } from '../../../Common/File';
import { warn } from '../../../Common/Log';
import { toTsArray } from '../../../Common/UeHelper';
import { deepEquals, genGuid, readJsonObj, writeJsonObj } from '../../../Common/Util';
import { IEntityData, TComponentsState } from '../../Interface';
import { gameConfig } from '../Config';

export interface IEntityTemplate {
    Guid: string;
    PrefabId: number;
    ComponentsState: TComponentsState;
}

function getEntityTemplateFiles(): string[] {
    const dir = gameConfig.EntityTemplateDir;
    const array = NewArray(BuiltinString);
    MyFileHelper.FindFiles($ref(array), dir, 'json');
    const files = toTsArray(array);
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
            this.GuidMap.set(guid, template);
            this.NameByGuid.set(guid, name);
            this.GuidByName.set(name, guid);
        });
    }

    public static GetTemplateByGuid(guid: string): IEntityTemplate {
        return this.GuidMap.get(guid);
    }

    public static GetNameByGuid(guid: string): string {
        return this.NameByGuid.get(guid);
    }

    public static GetGuidByName(name: string): string {
        return this.GuidByName.get(name);
    }

    public static GetPath(guid: string): string {
        const dir = gameConfig.EntityTemplateDir;
        const name = this.GetNameByGuid(guid);
        return `${dir}/${name}.json`;
    }

    public static GenDefaultGuid(): string {
        return this.GetGuidByName(this.Names[0]);
    }

    public static Gen(data: IEntityData, guid?: string): IEntityTemplate {
        return {
            Guid: guid || genGuid(),
            PrefabId: data.PrefabId,
            ComponentsState: data.ComponentsState,
        };
    }

    public static Load(path: string): IEntityTemplate {
        return readJsonObj<IEntityTemplate>(path);
    }

    public static Save(data: IEntityData, path: string): void {
        const existTemplate = this.Load(path);
        const template = this.Gen(data, existTemplate ? existTemplate.Guid : undefined);
        writeJsonObj(template, path);
    }

    // 将Template中的数据写入EntityData中,如果数据一样,则返回传入的data
    // 否则构造一个新的IEntityData
    public static ProduceEntityData(template: IEntityTemplate, data: IEntityData): IEntityData {
        const componentsState = template.ComponentsState;

        // 取模板中共同的Component配置
        const componentsStateNew = Object.assign({}, data.ComponentsState);
        let modifyCount = 0;
        let sameComponentCount = 0;
        for (const key in componentsState) {
            if (componentsStateNew[key]) {
                sameComponentCount++;
                if (!deepEquals(componentsStateNew[key], componentsState[key])) {
                    componentsStateNew[key] = componentsState[key];
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
            draft.ComponentsState = componentsStateNew;
        });
        return newData;
    }
}

EntityTemplateOp.RefreshTemplates();
