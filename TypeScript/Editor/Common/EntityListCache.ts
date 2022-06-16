/* eslint-disable spellcheck/spell-checker */
import { ITsEntityBase } from '../../Common/Interface/IEntity';
import { error } from '../../Common/Misc/Log';
import LevelEditorUtil from './LevelEditorUtil';

class EntityListCache {
    private Lables: string[];

    private Ids: number[];

    private Entities: ITsEntityBase[];

    private readonly EntityByLabel = new Map<string, ITsEntityBase>();

    private readonly EntityById = new Map<number, ITsEntityBase>();

    public constructor() {
        this.RefreshCache();
    }

    public RefreshCache(): void {
        const entities = LevelEditorUtil.GetAllEntitiesByEditorWorld();
        this.Entities = entities;
        this.Lables = entities.map((entity) => entity.ActorLabel);
        this.Ids = entities.map((entity) => entity.Id);
        this.EntityByLabel.clear();
        this.EntityById.clear();
        entities.forEach((entity) => {
            if (this.EntityByLabel.has(entity.ActorLabel)) {
                error(`重复的ActorLabel ${entity.ActorLabel}`);
            }
            this.EntityByLabel.set(entity.ActorLabel, entity);
            this.EntityById.set(entity.Id, entity);
        });
    }

    public GetNames(): string[] {
        return this.Lables;
    }

    public GetIds(): number[] {
        return this.Ids;
    }

    public GetAllEntities(): ITsEntityBase[] {
        return this.Entities;
    }

    public GetEntityById(id: number): ITsEntityBase {
        return this.EntityById.get(id);
    }

    public GetEntityByLable(name: string): ITsEntityBase {
        return this.EntityByLabel.get(name);
    }
}

export const entityListCache = new EntityListCache();
