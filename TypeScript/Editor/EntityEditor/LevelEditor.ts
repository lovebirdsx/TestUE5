/* eslint-disable spellcheck/spell-checker */
import { Actor, EditorLevelLibrary, EditorOperations, TArray } from 'ue';

import { isChildOfClass } from '../../Common/Class';
import { log } from '../../Common/Log';
import { genGuid } from '../../Common/Util';
import { gameConfig } from '../../Game/Common/Config';
import { TsEntity } from '../../Game/Entity/Public';
import { LevelSerializer } from '../../Game/Serialize/LevelSerializer';
import LevelEditorUtil from '../Common/LevelEditorUtil';

export class LevelEditor {
    private readonly LevelSerializer = new LevelSerializer();

    public constructor() {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
        editorEvent.OnDuplicateActorsEnd.Add(this.OnDuplicateActorsEnd.bind(this));
        editorEvent.OnEditPasteActorsEnd.Add(this.OnEditPasteActorsEnd.bind(this));
        editorEvent.OnNewActorsDropped.Add(this.OnNewActorsDropped.bind(this));
    }

    public GetMapDataPath(): string {
        const world = EditorLevelLibrary.GetEditorWorld();
        return gameConfig.GetCurrentMapDataPath(world);
    }

    public GetMapSavePath(): string {
        const world = EditorLevelLibrary.GetEditorWorld();
        return gameConfig.GetCurrentMapSavePath(world);
    }

    public Save(): void {
        const entities = LevelEditorUtil.GetAllEntitiesByEditorWorld();
        this.LevelSerializer.Save(entities, undefined, this.GetMapDataPath());
    }

    private OnPreBeginPie(): void {
        log('OnPreBeginPie');
    }

    private CheckEntityInit(actor: Actor): void {
        if (!isChildOfClass(actor, TsEntity)) {
            return;
        }

        const entity = actor as TsEntity;
        entity.Guid = genGuid();
    }

    private InitForNewActors(): void {
        const actors = EditorLevelLibrary.GetSelectedLevelActors();
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            this.CheckEntityInit(actor);
        }
    }

    private OnDuplicateActorsEnd(): void {
        this.InitForNewActors();
    }

    private OnEditPasteActorsEnd(): void {
        this.InitForNewActors();
    }

    private OnNewActorsDropped(actors: TArray<Actor>): void {
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            this.CheckEntityInit(actor);
        }
    }
}
