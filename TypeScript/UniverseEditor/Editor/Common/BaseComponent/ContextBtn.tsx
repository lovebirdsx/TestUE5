/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { List, Text } from './CommonComponent';

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

    private Check(): void {
        this.props.Commands.forEach((cmd, index) => {
            if (this.props.Commands.indexOf(cmd, index + 1) > 0) {
                throw new Error(`重复的指令[${cmd}]`);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        this.Check();
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

export interface IMenuItem {
    Name: string;
    Fun: () => void;
}

export interface IMenuBtnProps {
    Name: string;
    Items: IMenuItem[];
}

export class MenuBtn extends React.Component<IMenuBtnProps> {
    public constructor(props: IMenuBtnProps) {
        super(props);
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const items = this.props.Items;
        return (
            <HorizontalBox>
                <ContextBtn
                    Commands={items.map((item) => item.Name)}
                    OnCommand={function (cmd: string): void {
                        const item = items.find((i) => i.Name === cmd);
                        item.Fun();
                    }}
                />
                <Text Text={this.props.Name + '  '} />
            </HorizontalBox>
        );
    }
}
