import { ITsEntityBase } from '../../Common/Interface/IEntity';
import { error } from '../../Common/Misc/Log';

class TempEntities {
    private readonly Entities: Set<ITsEntityBase> = new Set();

    public Add(entity: ITsEntityBase): void {
        if (this.Entities.has(entity)) {
            error(`Add duplicate temp entity [${entity.GetName()}]`);
            return;
        }
        this.Entities.add(entity);
    }

    public Remove(entity: ITsEntityBase): void {
        if (!this.Entities.has(entity)) {
            error(`Remove no exist temp entity [${entity.GetName()}]`);
            return;
        }
        this.Entities.delete(entity);
    }

    public Contains(entity: ITsEntityBase): boolean {
        return this.Entities.has(entity);
    }
}

export const tempEntities = new TempEntities();
