import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { IProps } from '../../../../Common/Type';
import { List } from '../../BaseComponent/CommonComponent';
import { flowContext } from '../Context';

const DEFAULT_STATE_ID = 1;

// eslint-disable-next-line @typescript-eslint/naming-convention
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
