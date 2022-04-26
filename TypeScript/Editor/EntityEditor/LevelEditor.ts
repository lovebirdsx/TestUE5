import { EditorOperations } from 'ue';

import { log } from '../../Common/Log';
import { LevelSerializer } from '../../Game/Serialize/LevelSerializer';
import LevelEditorUtil from '../Common/LevelEditorUtil';

export class LevelEditor {
    private readonly LevelSerializer = new LevelSerializer();

    public constructor() {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnPreSaveWorld.Add(this.OnPreSaveWorld.bind(this));
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
    }

    public Save(): void {
        const entities = LevelEditorUtil.GetAllEntitiesByEditorWorld();
        this.LevelSerializer.Save(entities);
    }

    private OnPreSaveWorld(): void {
        log('OnPreSaveWorld');
    }

    private OnPreBeginPie(): void {
        log('OnPreBeginPie');
    }
}
