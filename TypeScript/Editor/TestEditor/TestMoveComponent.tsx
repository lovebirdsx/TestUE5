/* eslint-disable spellcheck/spell-checker */
import { produce } from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { Btn, Text } from '../Common/BaseComponent/CommonComponent';

interface IChildInfo {
    Id: number;
    Name: string;
}

interface IChildProps {
    Config: IChildInfo;
    OnMove: (child: IChildInfo, isUp: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function Child(props: IChildProps): JSX.Element {
    return (
        <HorizontalBox>
            <Text Text={props.Config.Id.toString()}></Text>
            <Text Text={props.Config.Name}></Text>
            <Btn
                Text=" ▲ "
                OnClick={(): void => {
                    props.OnMove(props.Config, true);
                }}
            />
            <Btn
                Text=" ▼ "
                OnClick={(): void => {
                    props.OnMove(props.Config, false);
                }}
            />
        </HorizontalBox>
    );
}

interface ITestMoveComponentState {
    Children: IChildInfo[];
}

export class TestMoveComponent extends React.Component<unknown, ITestMoveComponentState> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            Children: [
                { Id: 0, Name: 'Name1' },
                { Id: 1, Name: 'Name2' },
            ],
        };
    }

    private readonly OnMove = (child: IChildInfo, isUp: boolean): void => {
        this.setState((state) => {
            return produce(state, (draft) => {
                const id = state.Children.findIndex((e) => e.Id === child.Id);
                if (isUp) {
                    if (id > 0) {
                        draft.Children[id] = state.Children[id - 1];
                        draft.Children[id - 1] = state.Children[id];
                    }
                } else {
                    if (id < state.Children.length - 1) {
                        draft.Children[id] = state.Children[id + 1];
                        draft.Children[id + 1] = state.Children[id];
                    }
                }
            });
        });
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const childs = this.state.Children.map((e, id) => {
            return <Child key={id} Config={e} OnMove={this.OnMove}></Child>;
        });
        return <VerticalBox>{childs}</VerticalBox>;
    }
}
