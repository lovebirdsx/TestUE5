import { error } from '../../Common/Misc/Log';
import { ITsEntity } from '../../Game/Interface';

class TempEntities {
    private readonly Entities: Set<ITsEntity> = new Set();

    public Add(entity: ITsEntity): void {
        if (this.Entities.has(entity)) {
            error(`Add duplicate temp entity [${entity.GetName()}]`);
            return;
        }
        this.Entities.add(entity);
    }

    public Remove(entity: ITsEntity): void {
        if (!this.Entities.has(entity)) {
            error(`Remove no exist temp entity [${entity.GetName()}]`);
            return;
        }
        this.Entities.delete(entity);
    }

    public Contains(entity: ITsEntity): boolean {
        return this.Entities.has(entity);
    }
}

export const tempEntities = new TempEntities();
