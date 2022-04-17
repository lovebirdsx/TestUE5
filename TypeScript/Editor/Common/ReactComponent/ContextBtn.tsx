/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { List } from './CommonComponent';

export interface IContextBtnProps {
    Commands: string[];
    OnCommand: (cmd: string) => void;
    Tip?: string;
}

interface IContextBtnState {
    OprationCount: number;
}

export class ContextBtn extends React.Component<IContextBtnProps, IContextBtnState> {
    public constructor(props: IContextBtnProps) {
        super(props);
        this.state = {
            OprationCount: 0,
        };
    }

    private readonly OnSelectChanged = (option: string): void => {
        this.setState((state) => {
            return {
                OprationCount: state.OprationCount + 1,
            };
        });
        this.props.OnCommand(option);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const selected = this.state.OprationCount % 2 === 0 ? '0' : '1';
        const { Commands: commands, Tip: tip } = this.props;
        return (
            <List
                Items={commands}
                Selected={selected}
                OnSelectChanged={this.OnSelectChanged}
                Tip={tip}
            />
        );
    }
}
