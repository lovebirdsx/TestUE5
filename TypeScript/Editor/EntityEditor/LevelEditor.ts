/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { Actor, EditorLevelLibrary, EditorOperations, TArray } from 'ue';

import { delay } from '../../Common/Async';
import { error, log } from '../../Common/Log';
import { GameConfig } from '../../Game/Common/GameConfig';
import { isEntity } from '../../Game/Entity/EntityRegistry';
import { ITsEntity } from '../../Game/Interface';
import { saveLevelData, tryGetWorldLevelName } from '../../Game/Interface/Level';
import { currentLevelEntityIdGenerator } from '../Common/Operations/Entity';
import { openFile } from '../Common/Util';
import { tempEntities } from './TempEntities';

export class LevelEditor {
    public constructor() {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
        editorEvent.OnDuplicateActorsEnd.Add(this.OnDuplicateActorsEnd.bind(this));
        editorEvent.OnEditPasteActorsEnd.Add(this.OnEditPasteActorsEnd.bind(this));
        editorEvent.OnNewActorsDropped.Add(this.OnNewActorsDropped.bind(this));
    }

    public GetMapDataPath(): string {
        const world = EditorLevelLibrary.GetEditorWorld() || EditorLevelLibrary.GetGameWorld();
        return GameConfig.GetCurrentLevelDataPath(world);
    }

    public SaveMapData(): void {
        const world = EditorLevelLibrary.GetEditorWorld() || EditorLevelLibrary.GetGameWorld();
        const levelName = tryGetWorldLevelName(world.GetName());
        if (!levelName) {
            error(`Can not save map data, no level name for world [${world.GetName()}]`);
            return;
        }

        const savePath = this.GetMapDataPath();
        saveLevelData(levelName, savePath);
        log(`Save level data to ${savePath}`);
    }

    public OpenMapDataFile(): void {
        openFile(this.GetMapDataPath());
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
}
