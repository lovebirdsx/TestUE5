/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { VerticalBox } from 'react-umg';
import { Class, EditorLevelLibrary, EditorOperations, KismetMathLibrary } from 'ue';

import TsEntity from '../../Game/Entity/TsEntity';
import { Text } from '../Common/Component/CommonComponent';
import { error, log } from '../Common/Log';

interface IEntityEditorState {
    Name: string;
    Entity: TsEntity;
}

export class EntityEditor extends React.Component<unknown, IEntityEditorState> {
    private readonly EntityClass: Class;

    public constructor(props: unknown) {
        super(props);
        this.state = {
            Name: 'Hello Entity Editor',
            Entity: this.GetCurrentSelectEntity(),
        };
        this.EntityClass = Class.Load(
            '/Game/Blueprints/TypeScript/Game/Entity/TsEntity.TsEntity_C',
        );
        if (!this.EntityClass) {
            error(`Can not load entity class`);
        }
    }

    private GetCurrentSelectEntity(): TsEntity | null {
        if (!this.EntityClass) {
            return null;
        }

        const actors = EditorLevelLibrary.GetSelectedLevelActors();
        if (actors.Num() !== 1) {
            return null;
        }

        const actor = actors.Get(0);
        const actorClass = actor.GetClass();
        if (KismetMathLibrary.ClassIsChildOf(actorClass, this.EntityClass)) {
            return actor as TsEntity;
        }

        log(`ActorClassName=${actorClass.GetName()} EntityClassName=${this.EntityClass.GetName()}`);

        return null;
    }

    private readonly OnSelectionChanged = (): void => {
        this.setState({
            Entity: this.GetCurrentSelectEntity(),
        });
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public UNSAFE_componentWillMount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Add(this.OnSelectionChanged);
    }

    public ComponentWillUnmount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Remove(this.OnSelectionChanged);
    }

    private RenderEntity(): JSX.Element {
        const entity = this.state.Entity;
        if (!entity) {
            return <Text Text={'select entity to modify'} />;
        }

        return <Text Text={`Entity = ${entity.GetName()}`} />;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <VerticalBox>
                <Text Text={this.state.Name} />
                {this.RenderEntity()}
            </VerticalBox>
        );
    }
}
