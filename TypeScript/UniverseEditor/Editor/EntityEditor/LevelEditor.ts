/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, EditorLevelLibrary } from 'ue';

import { Config } from '../../Common/Config';
import { actorTransactionManager } from './ActorTransactionManager';

export class LevelEditor {
    public constructor() {
        actorTransactionManager.ActorAdded.AddCallback(this.OnActorAdded.bind(this));
        actorTransactionManager.ActorDeleted.AddCallback(this.OnActorDeleted.bind(this));
    }

    public GetMapSavePath(): string {
        const world = EditorLevelLibrary.GetEditorWorld();
        return Config.GetCurrentLevelSavePath(world);
    }

    private OnActorAdded(actor: Actor): void {
        //
    }

    private OnActorDeleted(actor: Actor): void {
        //
    }
}
