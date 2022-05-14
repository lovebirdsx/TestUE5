/* eslint-disable spellcheck/spell-checker */
import { EditorOperations } from 'ue';

import { isEditor } from '../Common/Util';
import { gameConfig } from './Common/GameConfig';
import { StateComponent } from './Component/StateComponent';
import { loadTsEntity } from './Entity/Common';
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

    public LoadGame(): void {
        const stateManager = gameContext.StateManager;
        stateManager.Load();

        const entities = gameContext.EntityManager.GetAllEntites();
        entities.forEach((entity) => {
            loadTsEntity(entity);
        });
    }

    private SaveEntityState(entity: ITsEntity): void {
        const stateComponent = entity.Entity.TryGetComponent(StateComponent);
        if (stateComponent) {
            gameContext.StateManager.SetState(entity.Guid, stateComponent.GenSnapshot());
        }
    }

    private DeleteEntityState(guid: string): void {
        gameContext.StateManager.DeleteState(guid);
    }

    public SaveGame(): void {
        const entities = gameContext.EntityManager.GetAllEntites();
        entities.forEach((entity) => {
            this.SaveEntityState(entity);
        });
        gameContext.StateManager.Save();
    }

    public Init(): void {
        const entityMananger = gameContext.EntityManager;
        entityMananger.EntityRemoved.AddCallback(this.DeleteEntityState.bind(this));
        entityMananger.EntityDeregistered.AddCallback(this.SaveEntityState.bind(this));
    }

    public Exit(): void {
        //
    }
}
