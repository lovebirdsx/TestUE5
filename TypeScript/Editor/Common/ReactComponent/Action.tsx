/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import { VerticalBox } from 'react-umg';

import { EObjectFilter, IAbstractType, TModifyType } from '../../../Common/Type';
import { IActionInfo } from '../../../Game/Flow/Action';
import { actionRegistry } from '../Scheme/Action/Index';
import { TAB_OFFSET } from './CommonComponent';
import { ContextBtn } from './ContextBtn';
import { Dynamic } from './Dynamic';

export interface IActionProps {
    Action: IActionInfo;
    ObjectFilter: EObjectFilter;
    OnModify: (action: IActionInfo, type: TModifyType) => void;
    OnContextCommand: (cmd: string) => void;
}

export class Action extends React.Component<IActionProps> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { props } = this;
        const { Action: action } = props;
        const typeScheme = actionRegistry.GetDynamicObjectScheme(
            props.ObjectFilter,
        ) as IAbstractType<unknown>;

        return (
            <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                <Dynamic
                    Value={action as unknown}
                    Type={typeScheme}
                    OnModify={props.OnModify as (obj: unknown, type: TModifyType) => void}
                    PrefixElement={
                        <ContextBtn
                            Commands={['insert', 'remove', 'moveUp', 'moveDown']}
                            OnCommand={props.OnContextCommand}
                            Tip="针对当前动作项进行操作"
                        />
                    }
                />
            </VerticalBox>
        );
    }
}
