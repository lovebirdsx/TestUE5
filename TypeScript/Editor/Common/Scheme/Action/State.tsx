/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { IChangeRandomState, IChangeState, IFinishState } from '../../../../Game/Flow/Action';
import { List } from '../../Component/CommonComponent';
import { flowContext } from '../../Component/Flow';
import {
    createArrayScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
    EObjectFilter,
    IAnyProps,
    objectFilterExcept,
} from '../Type';

export const finishStateScheme = createObjectScheme<IFinishState>(
    {
        Result: createStringScheme({
            CreateDefault: () => '结果',
        }),
        Arg1: createStringScheme({
            Meta: { Optional: true },
            CreateDefault: () => '参数1',
        }),
        Arg2: createStringScheme({
            Meta: { Optional: true },
            CreateDefault: () => '参数2',
        }),
    },
    {
        Meta: {
            Tip: '结束状态,后续的动作将不被执行',
        },
        Filters: objectFilterExcept(EObjectFilter.Trigger),
    },
);

const DEFAULT_STATE_ID = 1;

const stateIdScheme = createIntScheme({
    Meta: {
        HideName: true,
    },
    CreateDefault: (container: unknown) => DEFAULT_STATE_ID,
    Render: (props: IAnyProps) => {
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
        Meta: {
            Tip: '跳转到状态,执行后将继续执行对应状态的动作',
        },
        Filters: objectFilterExcept(EObjectFilter.Trigger),
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
        Meta: {
            Tip: '随机选择一个状态进行跳转',
        },
        Filters: objectFilterExcept(EObjectFilter.Trigger),
    },
);
