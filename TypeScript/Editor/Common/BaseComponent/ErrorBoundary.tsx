import * as React from 'react';
import { VerticalBox } from 'react-umg';

import { error } from '../../../Common/Log';
import { Btn, H1, H2 } from './CommonComponent';

interface IErrorBoundaryState {
    Error: Error;
    ErrorInfo: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<unknown, IErrorBoundaryState> {
    public constructor(props: unknown) {
        super(props);
        this.state = { Error: undefined, ErrorInfo: undefined };
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public componentDidCatch(err: Error, errorInfo: React.ErrorInfo): void {
        error(err.message);
        error(err.stack);
        this.setState({
            Error: err,
            ErrorInfo: errorInfo,
        });
    }

    private readonly Clear = (): void => {
        this.setState({
            Error: undefined,
            ErrorInfo: undefined,
        });
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): React.ReactNode {
        if (this.state.ErrorInfo) {
            return (
                <VerticalBox>
                    <Btn
                        Text={'Clear'}
                        OnClick={this.Clear}
                        Color="#FF8C00 dark orange"
                        TextSize={12}
                    />
                    <H1 Text="Something went wrong."></H1>
                    <H2 Text={this.state.Error ? this.state.Error.message : ''}></H2>
                    <H2 Text={this.state.Error ? this.state.Error.stack : ''}></H2>
                </VerticalBox>
            );
        }

        return this.props.children;
    }
}
