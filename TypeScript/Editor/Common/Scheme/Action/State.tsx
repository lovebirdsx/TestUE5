/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import {
    createArrayScheme,
    createIntScheme,
    createObjectScheme,
    EActionFilter,
    IProps,
} from '../../../../Common/Type';
import { IChangeRandomState, IChangeState } from '../../../../Game/Flow/Action';
import { List } from '../../BaseComponent/CommonComponent';
import { flowContext } from '../../SchemeComponent/Context';

export const finishStateScheme = createObjectScheme(
    {},
    {
        Filters: [EActionFilter.FlowList],
        Meta: {
            Tip: '结束状态,后续的动作将不被执行',
        },
    },
);

const DEFAULT_STATE_ID = 1;

const stateIdScheme = createIntScheme({
    Meta: {
        HideName: true,
    },
    CreateDefault: () => DEFAULT_STATE_ID,
    Render: (props: IProps) => {
        return (
            <flowContext.Consumer>
                {(value): JSX.Element => {
                    const stateNames = value.States.map((e) => e.Name);
                    const selectedState = value.States.find((e) => e.Id === props.Value);
                    return (
                        <HorizontalBox>
                            {props.PrefixElement}
                            <List
                                Items={stateNames}
                                Selected={selectedState ? selectedState.Name : ''}
                                Tip="目标状态"
                                OnSelectChanged={(selectedStateName): void => {
                                    const state = value.States.find(
                                        (e) => e.Name === selectedStateName,
                                    );
                                    props.OnModify(state ? state.Id : DEFAULT_STATE_ID, 'normal');
                                }}
                            />
                        </HorizontalBox>
                    );
                }}
            </flowContext.Consumer>
        );
    },
});

export const changeStateScheme = createObjectScheme<IChangeState>(
    {
        StateId: stateIdScheme,
    },
    {
        Filters: [EActionFilter.FlowList, EActionFilter.Talk],
        Meta: {
            Tip: '改变Entity的状态,下一次再和实体交互,则将从此设定的状态开始',
        },
    },
);

export const changeRandomStateScheme = createObjectScheme<IChangeRandomState>(
    {
        StateIds: createArrayScheme({
            Element: stateIdScheme,
            Meta: {
                HideName: true,
            },
        }),
    },
    {
        Filters: [EActionFilter.FlowList],
        Meta: {
            Tip: '随机选择一个状态进行跳转',
        },
    },
);
