/* eslint-disable spellcheck/spell-checker */
import { ITsEntity } from '../../Game/Interface';
import LevelEditorUtil from './LevelEditorUtil';

class EntityListCache {
    private Names: string[];

    private Entities: ITsEntity[];

    private readonly EntityByName = new Map<string, ITsEntity>();

    private readonly EntityByGuid = new Map<string, ITsEntity>();

    public constructor() {
        this.RefreshCache();
    }

    public RefreshCache(): void {
        const entities = LevelEditorUtil.GetAllEntitiesByEditorWorld();
        this.Entities = entities;
        this.Names = entities.map((entity) => entity.GetName());
        this.EntityByName.clear();
        this.EntityByGuid.clear();
        entities.forEach((entity) => {
            this.EntityByName.set(entity.GetName(), entity);
            this.EntityByGuid.set(entity.Guid, entity);
        });
    }

    public GetNames(): string[] {
        return this.Names;
    }

    public GetAllEntities(): ITsEntity[] {
        return this.Entities;
    }

    public GetEntityByGuid(guid: string): ITsEntity {
        return this.EntityByGuid.get(guid);
    }

    public GetEntityByName(name: string): ITsEntity {
        return this.EntityByName.get(name);
    }
}

export const entityListCache = new EntityListCache();
