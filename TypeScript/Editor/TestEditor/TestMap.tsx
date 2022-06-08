import { $ref } from 'puerts';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { Actor, EditorLevelLibrary, EditorOperations, GameplayStatics, NewArray, TArray } from 'ue';

import { log, warn } from '../../Common/Log';
import { getClassByEntityType } from '../../Game/Interface/Entity';
import { Btn } from '../Common/BaseComponent/CommonComponent';

export class TestMap extends React.Component {
    public constructor() {
        super(undefined);
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

        // Delete Actor的消息并没有正常触发
        editorEvent.OnDeleteActorsBegin.Add(this.OnDeleteActorsBegin.bind(this));
        editorEvent.OnDeleteActorsEnd.Add(this.OnDeleteActorsEnd.bind(this));

        editorEvent.OnNewActorsDropped.Add(this.OnNewActorsDropped.bind(this));
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie.bind(this));
        editorEvent.OnBeginPie.Add(this.OnBeginPie.bind(this));
        editorEvent.OnEndPie.Add(this.OnEndPie.bind(this));
        editorEvent.OnPausePie.Add(this.OnPausePie.bind(this));
        editorEvent.OnResumePie.Add(this.OnResumePie.bind(this));

        editorEvent.OnActorAdded.Add(this.OnActorAdded.bind(this));
        editorEvent.OnActorDeleted.Add(this.OnActorDeleted.bind(this));
    }

    private readonly OnGetAllEntities = (): void => {
        const world = EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            warn('No editor world exist');
            return;
        }

        const actors = NewArray(Actor);
        GameplayStatics.GetAllActorsOfClass(world, getClassByEntityType('Entity'), $ref(actors));

        log(`TsEntity count = ${actors.Num()}`);
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            const status: string[] = [];
            status.push(`${i} ${actor.GetName()} bHidden=${actor.bHidden}`);
            status.push(`IsActorBeingDestroyed=${actor.IsActorBeingDestroyed()}`);
            log(status.join(' '));
        }
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn Text={'Get all entities'} OnClick={this.OnGetAllEntities} />
            </HorizontalBox>
        );
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

    private OnActorAdded(actor: Actor): void {
        log(`Add actor [${actor.ActorLabel}]`);
    }

    private OnActorDeleted(actor: Actor): void {
        log(`Delete actor [${actor.ActorLabel}]`);
    }
}
