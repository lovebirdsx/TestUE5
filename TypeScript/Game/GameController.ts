/* eslint-disable spellcheck/spell-checker */
import { EditorOperations } from 'ue';

import { isEditor } from '../Common/Util';
import { gameConfig } from './Common/GameConfig';
import { StateComponent } from './Component/StateComponent';
import { gameContext, IGameController, ITsEntity } from './Interface';

export class GameController implements IGameController {
    public constructor() {
        gameContext.GameController = this;

        if (isEditor()) {
            if (gameConfig.IsSaveWhileExitPie) {
                EditorOperations.GetEditorEvent().OnEndPie.Add(() => {
                    this.SaveGame();
                });
            }
        }
    }

    private OnEntityDeregistered(entity: ITsEntity): void {
        const stateComponent = entity.Entity.TryGetComponent(StateComponent);
        if (stateComponent) {
            gameContext.StateManager.SetState(entity.Id, stateComponent.GenSnapshot());
        }
    }

    private OnEntityRemoved(id: number): void {
        const entityMananger = gameContext.EntityManager;
        const spawnType = entityMananger.GetSpawnType(id);
        const destroyType = entityMananger.GetDestoryType(id);
        if (spawnType === 'user' && destroyType === 'delete') {
            gameContext.StateManager.DeleteState(id);
        } else if (spawnType === 'streaming' && destroyType === 'delete') {
            gameContext.StateManager.MarkDelete(id);
        }
    }

    public SaveGame(): void {
        const entities = gameContext.EntityManager.GetAllEntites();
        entities.forEach((entity) => {
            this.OnEntityDeregistered(entity);
        });
        gameContext.StateManager.Save();
    }

    public Init(): void {
        const entityMananger = gameContext.EntityManager;
        entityMananger.EntityRemoved.AddCallback(this.OnEntityRemoved.bind(this));
        entityMananger.EntityDeregistered.AddCallback(this.OnEntityDeregistered.bind(this));
    }

    public Exit(): void {
        //
    }
}
