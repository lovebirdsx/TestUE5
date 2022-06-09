/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, EditorLevelLibrary, EditorOperations, TArray } from 'ue';

import { delay } from '../../Common/Async';
import { log, warn } from '../../Common/Log';
import { GameConfig } from '../../Game/Common/GameConfig';
import { isEntity } from '../../Game/Entity/Common';
import { ITsEntity } from '../../Game/Interface';
import { levelDataManager } from '../Common/LevelDataManager';
import { currentLevelEntityIdGenerator } from '../Common/Operations/Entity';
import { getContentPackageName } from '../Common/Util';
import { actorTransactionManager } from './ActorTransactionManager';
import { tempEntities } from './TempEntities';

export class LevelEditor {
    public constructor() {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
        editorEvent.OnDuplicateActorsEnd.Add(this.OnDuplicateActorsEnd.bind(this));
        editorEvent.OnEditPasteActorsEnd.Add(this.OnEditPasteActorsEnd.bind(this));
        editorEvent.OnNewActorsDropped.Add(this.OnNewActorsDropped.bind(this));

        actorTransactionManager.ActorAdded.AddCallback(this.OnActorAdded.bind(this));
        actorTransactionManager.ActorDeleted.AddCallback(this.OnActorDeleted.bind(this));
    }

    public SaveMapData(): void {
        levelDataManager.Save();
    }

    public GetMapSavePath(): string {
        const world = EditorLevelLibrary.GetEditorWorld();
        return GameConfig.GetCurrentLevelSavePath(world);
    }

    private OnPreBeginPie(): void {
        // this.SaveCurrentEntity();
    }

    private CheckEntityInit(actor: Actor): void {
        if (!isEntity(actor)) {
            return;
        }

        const entity = actor as ITsEntity;
        if (tempEntities.Contains(entity)) {
            return;
        }

        if (!entity.Id) {
            entity.Id = currentLevelEntityIdGenerator.GenOne();
        }
    }

    private async InitForNewActors(): Promise<void> {
        // UE回调的时候,当前选择的并不是最新创建的Actor,所以需要延时一下处理
        await delay(0.2);

        const actors = EditorLevelLibrary.GetSelectedLevelActors();
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            this.CheckEntityInit(actor);
        }
    }

    private OnDuplicateActorsEnd(): void {
        void this.InitForNewActors();
    }

    private OnEditPasteActorsEnd(): void {
        void this.InitForNewActors();
    }

    private OnNewActorsDropped(actors: TArray<Actor>): void {
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            this.CheckEntityInit(actor);
        }
    }

    public Test(): void {
        const world = EditorLevelLibrary.GetEditorWorld();
        log(`Is in WPLevel = ${EditorOperations.IsInWpLevel(world)}`);
        log(getContentPackageName(world));
        log(EditorOperations.GetPackage(world).GetName());
    }

    private OnActorAdded(actor: Actor): void {
        warn(`Add [${actor.ActorLabel}]`);
    }

    private OnActorDeleted(actor: Actor): void {
        warn(`Del [${actor.ActorLabel}]`);
    }
}
