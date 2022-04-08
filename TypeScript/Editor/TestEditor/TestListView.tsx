/* eslint-disable spellcheck/spell-checker */

import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { Btn, List } from '../../Editor/Common/Component/CommonComponent';
import { FilterableList } from '../Common/Component/FilterableList';
import { log } from '../Common/Log';

interface ITestListViewState {
    SelectName: string;
    Names: string[];
}

export class TestListView extends React.Component<unknown, ITestListViewState> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            SelectName: 'Foo1',
            Names: ['Foo1', 'Foo2', 'Foo3', 'Bar1', 'Bar2', 'Bar3', 'Car1', 'Car2', 'Car3'],
        };
    }

    private readonly OnSelectedNameChanged = (item: string): void => {
        log(`select id changed to ${item}`);
        this.setState({
            SelectName: item,
        });
    };

    private readonly AddItem = (): void => {
        this.setState((state) =>
            produce(state, (draft) => {
                draft.Names.push(`item ${state.Names.length}`);
            }),
        );
    };

    private readonly RemoveItem = (): void => {
        this.setState((state) =>
            produce(state, (draft) => {
                draft.Names.pop();
            }),
        );
    };

    private readonly Select = (id: number): void => {
        this.setState((state) =>
            produce(state, (draft) => {
                draft.SelectName = state.Names[id];
            }),
        );
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const state = this.state;
        return (
            <VerticalBox>
                <HorizontalBox>
                    <List
                        Items={state.Names}
                        OnSelectChanged={this.OnSelectedNameChanged}
                        Selected={state.SelectName}
                    />
                    <Btn Text={'+ item'} OnClick={this.AddItem} />
                    <Btn Text={'- item'} OnClick={this.RemoveItem} />
                    <Btn
                        Text={'0'}
                        OnClick={(): void => {
                            this.Select(0);
                        }}
                    />
                    <Btn
                        Text={'1'}
                        OnClick={(): void => {
                            this.Select(1);
                        }}
                    />
                    <Btn
                        Text={'2'}
                        OnClick={(): void => {
                            this.Select(2);
                        }}
                    />
                </HorizontalBox>
                <FilterableList
                    Items={state.Names}
                    Selected={state.SelectName}
                    OnSelectChanged={this.OnSelectedNameChanged}
                />
            </VerticalBox>
        );
    }
}
