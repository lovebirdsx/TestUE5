/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import { VerticalBox } from 'react-umg';

import { EActionFilter, Scheme, TModifyType } from '../../../Common/Type';
import { IActionInfo } from '../../../Game/Flow/Action';
import { TAB_OFFSET } from '../BaseComponent/CommonComponent';
import { ContextBtn } from '../BaseComponent/ContextBtn';
import { actionRegistry } from '../Scheme/Action/Public';
import { Dynamic } from '../SchemeComponent/Public';

export interface IActionProps {
    Action: IActionInfo;
    ActionFilter: EActionFilter;
    OnModify: (action: IActionInfo, type: TModifyType) => void;
    OnContextCommand: (cmd: string) => void;
}

export class Action extends React.Component<IActionProps> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { props } = this;
        const { Action: action } = props;
        const typeScheme = actionRegistry.GetActionScheme(props.ActionFilter) as Scheme;

        return (
            <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                <Dynamic
                    Value={action as unknown}
                    Scheme={typeScheme}
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
