/* eslint-disable spellcheck/spell-checker */

import produce from 'immer';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { IProps, TModifyType } from '../../../../Common/Type';
import { IActionInfo, TActionType } from '../../../../Game/Flow/Action';
import { ActionScheme } from '../../../../Game/Scheme/Action/Action';
import { actionRegistry } from '../../../../Game/Scheme/Action/Public';
import { Check, List, Text } from '../../BaseComponent/CommonComponent';
import { Any } from './Any';

export class Dynamic extends React.Component<IProps> {
    private readonly Select = (name: string): void => {
        const action = actionRegistry.SpawnAction(name as TActionType);
        this.props.OnModify(action, 'normal');
    };

    private readonly ChangeAsync = (async: boolean): void => {
        const action = this.props.Value as IActionInfo;
        const newAction = produce(action, (draft) => {
            draft.Async = async;
        });
        this.props.OnModify(newAction, 'normal');
    };

    private readonly Modify = (obj: unknown, type: TModifyType): void => {
        const { Value: value } = this.props;
        const action = value as IActionInfo;
        const newValue = produce(action, (draft) => {
            draft.Params = obj;
        });
        this.props.OnModify(newValue, type);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { Scheme: type, Value: value, PrefixElement: prefixElement } = this.props;
        const action = value as IActionInfo;
        const dynamicType = type as ActionScheme;
        const actionTypeData = actionRegistry.GetScheme(action.Name);

        return (
            <Any
                Value={action.Params}
                Scheme={actionTypeData}
                OnModify={this.Modify}
                PrefixElement={
                    <HorizontalBox>
                        {prefixElement}
                        <List
                            Items={actionRegistry.GetActionNames(dynamicType.Filter)}
                            Selected={action.Name}
                            OnSelectChanged={this.Select}
                            Tip={actionTypeData.Tip}
                        />
                        {actionTypeData.Scheduled && (
                            <Text Text="异步" Tip="是否以异步方式执行动作" />
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
