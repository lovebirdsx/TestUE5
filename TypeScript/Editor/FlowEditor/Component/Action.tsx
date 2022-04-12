/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import { VerticalBox } from 'react-umg';

import { IActionInfo } from '../../../Game/Flow/Action';
import { Any } from '../../Common/Component/Any';
import { TAB_OFFSET } from '../../Common/Component/CommonComponent';
import { ContextBtn } from '../../Common/Component/ContextBtn';
import { IAbstractType, scheme, TModifyType } from '../../Common/Scheme/Action';

export interface IActionProps {
    Action: IActionInfo;
    OnModify: (action: IActionInfo, type: TModifyType) => void;
    OnContextCommand: (cmd: string) => void;
}

export class Action extends React.Component<IActionProps> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { props } = this;
        const { Action: action } = props;
        return (
            <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                <Any
                    Value={action as unknown}
                    Type={scheme.GetNormalActionScheme() as IAbstractType<unknown>}
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
