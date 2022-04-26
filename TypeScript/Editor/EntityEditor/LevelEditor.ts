import { Actor, EditorOperations, TArray } from 'ue';

import { log } from '../../Common/Log';

export class LevelEditor {
    public constructor() {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnPreSaveWorld.Add(this.OnPreSaveWorld.bind(this));
        editorEvent.ActorPropertiesChange.Add(this.ActorPropertiesChange.bind(this));
        editorEvent.OnEditCutActorsBegin.Add(this.OnEditCutActorsBegin.bind(this));
        editorEvent.OnEditCutActorsEnd.Add(this.OnEditCutActorsEnd.bind(this));
        editorEvent.OnEditCopyActorsBegin.Add(this.OnEditCopyActorsBegin.bind(this));
        editorEvent.OnEditCopyActorsEnd.Add(this.OnEditCopyActorsEnd.bind(this));
        editorEvent.OnEditPasteActorsBegin.Add(this.OnEditPasteActorsBegin.bind(this));
        editorEvent.OnEditPasteActorsEnd.Add(this.OnEditPasteActorsEnd.bind(this));
        editorEvent.OnDuplicateActorsBegin.Add(this.OnDuplicateActorsBegin.bind(this));
        editorEvent.OnDuplicateActorsEnd.Add(this.OnDuplicateActorsEnd.bind(this));
        editorEvent.OnDeleteActorsBegin.Add(this.OnDeleteActorsBegin.bind(this));
        editorEvent.OnDeleteActorsEnd.Add(this.OnDeleteActorsEnd.bind(this));
        editorEvent.OnNewActorsDropped.Add(this.OnNewActorsDropped.bind(this));
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
        editorEvent.OnBeginPie.Add(this.OnBeginPie.bind(this));
        editorEvent.OnEndPie.Add(this.OnEndPie.bind(this));
        editorEvent.OnPausePie.Add(this.OnPausePie.bind(this));
        editorEvent.OnResumePie.Add(this.OnResumePie.bind(this));
    }

    private OnPreSaveWorld(): void {
        log('OnPreSaveWorld');
    }

    private ActorPropertiesChange(): void {
        log('ActorPropertiesChange');
    }

    private OnEditCutActorsBegin(): void {
        log('OnEditCutActorsBegin');
    }

    private OnEditCutActorsEnd(): void {
        log('OnEditCutActorsEnd');
    }

    private OnEditCopyActorsBegin(): void {
        log('OnEditCopyActorsBegin');
    }

    private OnEditCopyActorsEnd(): void {
        log('OnEditCopyActorsEnd');
    }

    private OnEditPasteActorsBegin(): void {
        log('OnEditPasteActorsBegin');
    }

    private OnEditPasteActorsEnd(): void {
        log('OnEditPasteActorsEnd');
    }

    private OnDuplicateActorsBegin(): void {
        log('OnDuplicateActorsBegin');
    }

    private OnDuplicateActorsEnd(): void {
        log('OnDuplicateActorsEnd');
    }

    private OnDeleteActorsBegin(): void {
        log('OnDeleteActorsBegin');
    }

    private OnDeleteActorsEnd(): void {
        log('OnDeleteActorsEnd');
    }

    private OnNewActorsDropped(actors: TArray<Actor>): void {
        log(`OnNewActorsDropped actors count = ${actors.Num()}`);
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            log(`${i} ${actor.GetName()}`);
        }
    }

    private OnPreBeginPie(): void {
        log('OnPreBeginPie');
    }

    private OnBeginPie(isSim: boolean): void {
        log(`OnBeginPie isSim ${isSim}`);
    }

    private OnEndPie(): void {
        log('OnEndPie');
    }

    private OnPausePie(): void {
        log('OnPausePie');
    }

    private OnResumePie(): void {
        log('OnResumePie');
    }
}
