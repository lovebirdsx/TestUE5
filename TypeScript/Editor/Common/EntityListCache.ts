/* eslint-disable spellcheck/spell-checker */
import { error } from '../../Common/Log';
import { ITsEntity } from '../../Game/Interface';
import LevelEditorUtil from './LevelEditorUtil';

class EntityListCache {
    private Lables: string[];

    private Guids: string[];

    private Entities: ITsEntity[];

    private readonly EntityByLabel = new Map<string, ITsEntity>();

    private readonly EntityByGuid = new Map<string, ITsEntity>();

    public constructor() {
        this.RefreshCache();
    }

    public RefreshCache(): void {
        const entities = LevelEditorUtil.GetAllEntitiesByEditorWorld();
        this.Entities = entities;
        this.Lables = entities.map((entity) => entity.ActorLabel);
        this.Guids = entities.map((entity) => entity.Guid);
        this.EntityByLabel.clear();
        this.EntityByGuid.clear();
        entities.forEach((entity) => {
            if (this.EntityByLabel.has(entity.ActorLabel)) {
                error(`重复的ActorLabel ${entity.ActorLabel}`);
            }
            this.EntityByLabel.set(entity.ActorLabel, entity);
            this.EntityByGuid.set(entity.Guid, entity);
        });
    }

    public GetNames(): string[] {
        return this.Lables;
    }

    public GetGuids(): string[] {
        return this.Guids;
    }

    public GetAllEntities(): ITsEntity[] {
        return this.Entities;
    }

    public GetEntityByGuid(guid: string): ITsEntity {
        return this.EntityByGuid.get(guid);
    }

    public GetEntityByLable(name: string): ITsEntity {
        return this.EntityByLabel.get(name);
    }
}

export const entityListCache = new EntityListCache();
