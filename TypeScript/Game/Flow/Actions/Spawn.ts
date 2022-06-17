/* eslint-disable spellcheck/spell-checker */
import { ISpawn } from '../../../UniverseEditor/Common/Interface/IAction';
import { EntitySpawnerComponent } from '../../Component/EntitySpawnerComponent';
import { Action } from '../ActionRunner';

export class SpawnChildAction extends Action<ISpawn> {
    public Execute(): void {
        const spawnerComponent = this.Entity.GetComponent(EntitySpawnerComponent);
        spawnerComponent.Spawn(this.Data);
    }
}

export class DestroyAllChildAction extends Action<undefined> {
    public Execute(): void {
        const spawnerComponent = this.Entity.GetComponent(EntitySpawnerComponent);
        spawnerComponent.DestroyAllChild();
    }
}

export class DestroyAction extends Action<undefined> {
    public Execute(): void {
        const spawnerComponent = this.Entity.GetComponent(EntitySpawnerComponent);
        spawnerComponent.Destroy();
    }
}
