/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, EditorLevelLibrary, EditorOperations } from 'ue';

import { log } from '../../Common/Log';
import { GameConfig } from '../../Game/Common/GameConfig';
import { getContentPackageName } from '../Common/Util';
import { actorTransactionManager } from './ActorTransactionManager';

export class LevelEditor {
    public constructor() {
        actorTransactionManager.ActorAdded.AddCallback(this.OnActorAdded.bind(this));
        actorTransactionManager.ActorDeleted.AddCallback(this.OnActorDeleted.bind(this));
    }

    public GetMapSavePath(): string {
        const world = EditorLevelLibrary.GetEditorWorld();
        return GameConfig.GetCurrentLevelSavePath(world);
    }

    public Test(): void {
        const world = EditorLevelLibrary.GetEditorWorld();
        log(`Is in WPLevel = ${EditorOperations.IsInWpLevel(world)}`);
        log(getContentPackageName(world));
        log(EditorOperations.GetPackage(world).GetName());
    }

    private OnActorAdded(actor: Actor): void {
        //
    }

    private OnActorDeleted(actor: Actor): void {
        //
    }
}
