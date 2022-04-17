/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';
import { EditorOperations, EMsgType } from 'ue';

import { Btn, Check } from '../Common/ReactComponent/CommonComponent';

interface ITestButtonState {
    IsButtonEnabled?: boolean;
}

export class TestButton extends React.Component<unknown, ITestButtonState> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            IsButtonEnabled: false,
        };
    }

    private readonly OnChecked = (checked: boolean): void => {
        this.setState({ IsButtonEnabled: checked });
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <VerticalBox>
                <HorizontalBox>
                    <Check OnChecked={this.OnChecked} UnChecked={!this.state.IsButtonEnabled} />
                    <Btn
                        Text={this.state.IsButtonEnabled ? 'Enabled' : 'Disabled'}
                        Disabled={!this.state.IsButtonEnabled}
                        OnClick={(): void => {
                            EditorOperations.ShowMessage(
                                EMsgType.Ok,
                                'Your Click the button',
                                'Hello',
                            );
                        }}
                    />
                </HorizontalBox>
            </VerticalBox>
        );
    }
}
