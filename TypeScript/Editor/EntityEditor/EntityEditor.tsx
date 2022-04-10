/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { VerticalBox } from 'react-umg';
import { EditorOperations } from 'ue';

import { Text } from '../Common/Component/CommonComponent';
import { log } from '../Common/Log';

interface IEntityEditorState {
    Name: string;
}

export class EntityEditor extends React.Component<unknown, IEntityEditorState> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            Name: 'Hello Entity Editor',
        };
    }

    private readonly OnSelectionChanged = (): void => {
        log('SelectionChanged');
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <VerticalBox>
                <Text Text={this.state.Name} />
            </VerticalBox>
        );
    }
}
