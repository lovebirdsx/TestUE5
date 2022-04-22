import produce from 'immer';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { Btn, EditorBox, IListProps, List } from './CommonComponent';

interface IFilterableListState {
    Filter: string;
    IsFilterExpand: boolean;
}

const MAX_ITEM_COUNT = 10;

export class FilterableList extends React.Component<IListProps, IFilterableListState> {
    public constructor(props: IListProps) {
        super(props);
        this.state = {
            Filter: '',
            IsFilterExpand: false,
        };
    }

    private readonly OnFilterBtnClicked = (): void => {
        this.setState((state) => {
            return {
                IsFilterExpand: !state.IsFilterExpand,
            };
        });
    };

    private readonly OnFilterTextChanged = (text: string): void => {
        this.setState({
            Filter: text.toLowerCase(),
        });
    };

    private readonly OnSelectChanged = (item: string): void => {
        this.props.OnSelectChanged(item);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        const state = this.state;
        const newProps = produce(props, (draft: IListProps) => {
            if (props.Items.length <= MAX_ITEM_COUNT) {
                return;
            }

            if (state.IsFilterExpand) {
                const filteredItems = props.Items.filter((item: string) =>
                    item.toLowerCase().includes(state.Filter),
                );
                draft.Items = filteredItems;
            }
            draft.OnSelectChanged = this.OnSelectChanged;
        });

        return (
            <HorizontalBox>
                <List {...newProps} />
                {props.Items.length > MAX_ITEM_COUNT && (
                    <Btn
                        Text={'▤'}
                        OnClick={this.OnFilterBtnClicked}
                        Tip={
                            '点击后，在弹出的输入框中填入字符串，下拉列表中的内容将匹配输入的字符串'
                        }
                    />
                )}

                {props.Items.length > MAX_ITEM_COUNT && state.IsFilterExpand && (
                    <EditorBox Text={state.Filter} OnChange={this.OnFilterTextChanged} />
                )}
            </HorizontalBox>
        );
    }
}
