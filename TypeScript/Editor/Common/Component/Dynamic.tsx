/* eslint-disable spellcheck/spell-checker */

import produce from 'immer';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { IActionInfo, TActionType } from '../../../Game/Flow/Action';
import { Check, List, Text } from './CommonComponent';
import { IAnyProps, scheme, TDynamicObjectType } from '../Scheme';
import { Any } from './Any';

export class Dynamic extends React.Component<IAnyProps> {
    private readonly Select = (type: string): void => {
        const action = scheme.SpawnAction(type as TActionType);
        this.props.OnModify(action);
    };

    private readonly ChangeAsync = (async: boolean): void => {
        const action = this.props.Value as IActionInfo;
        const newAction = produce(action, (draft) => {
            draft.Async = async;
        });
        this.props.OnModify(newAction);
    };

    private readonly Modify = (obj: unknown): void => {
        const { Value: value } = this.props;
        const action = value as IActionInfo;
        const newValue = produce(action, (draft) => {
            draft.Params = obj;
        });
        this.props.OnModify(newValue);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { Type: type, Value: value, PrefixElement: prefixElement } = this.props;
        const action = value as IActionInfo;
        const dynamicType = type as TDynamicObjectType;
        const actionTypeData = scheme.GetScheme(action.Name);

        return (
            <Any
                Value={action.Params}
                Type={actionTypeData}
                OnModify={this.Modify}
                PrefixElement={
                    <HorizontalBox>
                        {prefixElement}
                        <List
                            Items={scheme.GetActionNames(dynamicType.Filter)}
                            Selected={action.Name}
                            OnSelectChanged={this.Select}
                            Tip={actionTypeData.Meta.Tip}
                        />
                        {actionTypeData.Scheduled && (
                            <Text Text="async" Tip="是否以异步方式执行动作" />
                        )}
                        {actionTypeData.Scheduled && (
                            <Check UnChecked={!action.Async} OnChecked={this.ChangeAsync} />
                        )}
                    </HorizontalBox>
                }
            />
        );
    }
}
