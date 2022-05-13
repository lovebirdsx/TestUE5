/* eslint-disable @typescript-eslint/naming-convention */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { EActionFilter, IProps, ObjectScheme } from '../../../../Common/Type';
import { parseFlowInfo } from '../../../../Game/Flow/Action';
import { IBehaviorFlowComponent } from '../../../../Game/Interface';
import { Fold, List, Text } from '../../BaseComponent/CommonComponent';
import { flowContext } from '../Context';
import { Flow } from './Flow';

const DEFAULT_STATE_ID = 1;

export function RenderStateId(props: IProps<number>): JSX.Element {
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
}

export function RenderBehaviorFlow(
    props: IProps<IBehaviorFlowComponent, ObjectScheme<IBehaviorFlowComponent>>,
): JSX.Element {
    const value = props.Value ? props.Value : { InitStateId: 0, FlowInfo: parseFlowInfo('') };
    return (
        <VerticalBox>
            <HorizontalBox>
                <Fold
                    IsFold={value._folded}
                    IsFull={true}
                    OnChanged={(folded): void => {
                        const newValue = produce(value, (draft) => {
                            draft._folded = folded;
                        });
                        props.OnModify(newValue, 'fold');
                    }}
                />
                {props.PrefixElement}
            </HorizontalBox>
            {!value._folded && (
                <Flow
                    PrefixElement={RenderStateId({
                        PrefixElement: <Text Text={'初始状态:'} />,
                        Value: value.InitStateId,
                        OnModify: (stateId, type) => {
                            const newValue = produce(value, (draft) => {
                                draft.InitStateId = stateId;
                            });
                            props.OnModify(newValue, type);
                        },
                        Scheme: undefined,
                    })}
                    HideName={true}
                    Flow={value.FlowInfo}
                    ObjectFilter={EActionFilter.BehaviorFlow}
                    OnModify={(flow, type): void => {
                        const newValue = produce(value, (draft) => {
                            draft.FlowInfo = flow;
                        });
                        props.OnModify(newValue, type);
                    }}
                />
            )}
        </VerticalBox>
    );
}
