/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, EditorLevelLibrary, EditorOperations, TArray } from 'ue';

import { delay } from '../../Common/Async';
import { log } from '../../Common/Log';
import { GameConfig } from '../../Game/Common/GameConfig';
import { EntityTemplateOp } from '../../Game/Common/Operations/EntityTemplate';
import { entityRegistry, isEntity } from '../../Game/Entity/EntityRegistry';
import { ITsEntity } from '../../Game/Interface';
import { LevelSerializer } from '../../Game/Serialize/LevelSerializer';
import { EditorConfig } from '../Common/EditorConfig';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { tempEntities } from './TempEntities';

export class LevelEditor {
    private readonly LevelSerializer = new LevelSerializer();

    private IsDirty = false;

    public constructor() {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
        editorEvent.OnDuplicateActorsEnd.Add(this.OnDuplicateActorsEnd.bind(this));
        editorEvent.OnEditPasteActorsEnd.Add(this.OnEditPasteActorsEnd.bind(this));
        editorEvent.OnNewActorsDropped.Add(this.OnNewActorsDropped.bind(this));
    }

    public MarkDirty(): void {
        this.IsDirty = true;
    }

    public GetMapDataPath(): string {
        const world = EditorLevelLibrary.GetEditorWorld();
        return GameConfig.GetCurrentMapDataPath(world);
    }

    public GetMapSavePath(): string {
        const world = EditorLevelLibrary.GetEditorWorld();
        return GameConfig.GetCurrentMapSavePath(world);
    }

    public Save(): void {
        const entities = LevelEditorUtil.GetAllEntitiesByEditorWorld();
        this.LevelSerializer.Save(entities, this.GetMapDataPath());
    }

    public SaveCurrentEntity(): void {
        const entity = LevelEditorUtil.GetSelectedEntity();
        if (!entity) {
            return;
        }

        const entityData = entityRegistry.GenData(entity);
        EntityTemplateOp.Save(entityData, EditorConfig.LastEntityStateSavePath);
        log(`Last entity state save to ${EditorConfig.LastEntityStateSavePath}`);
    }

    private OnPreBeginPie(): void {
        this.SaveCurrentEntity();
    }

    private CheckEntityInit(actor: Actor): void {
        if (!isEntity(actor)) {
            return;
        }

        const entity = actor as ITsEntity;
        if (tempEntities.Contains(entity)) {
            return;
        }

        entity.Guid = actor.ActorGuid.ToString();
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
}
