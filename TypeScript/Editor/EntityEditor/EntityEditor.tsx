/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { VerticalBox } from 'react-umg';
import { EditorLevelLibrary, EditorOperations } from 'ue';

import { isChildOfClass } from '../../Common/Class';
import TsEntity from '../../Game/Entity/TsEntity';
import { Text } from '../Common/Component/CommonComponent';

interface IEntityEditorState {
    Name: string;
    Entity: TsEntity;
}

export class EntityEditor extends React.Component<unknown, IEntityEditorState> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            Name: 'Hello Entity Editor',
            Entity: this.GetCurrentSelectEntity(),
        };
    }

    private GetCurrentSelectEntity(): TsEntity | null {
        const actors = EditorLevelLibrary.GetSelectedLevelActors();
        if (actors.Num() !== 1) {
            return null;
        }

        const actor = actors.Get(0);
        if (isChildOfClass(actor, TsEntity)) {
            return actor as TsEntity;
        }

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
