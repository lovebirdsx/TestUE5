/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */

import * as React from 'react';
import { VerticalBox } from 'react-umg';

import { IActionInfo } from '../../../Game/Flow/Action';
import { Any } from '../../Common/Component/Any';
import { TAB_OFFSET } from '../../Common/Component/CommonComponent';
import { ContextBtn } from '../../Common/Component/ContextBtn';
import { IAbstractType, scheme } from '../../Common/Scheme/Action';

export interface ActionProps {
    action: IActionInfo;
    onModify: (action: IActionInfo) => void;
    onContextCommand: (cmd: string) => void;
}

export class Action extends React.Component<ActionProps> {
    public render(): JSX.Element {
        const { props } = this;
        const { action } = props;
        return (
            <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                <Any
                    Value={action as unknown}
                    Type={scheme.GetNormalActionScheme() as IAbstractType<unknown>}
                    OnModify={props.onModify as (obj: unknown) => void}
                    PrefixElement={
                        <ContextBtn
                            Commands={['insert', 'remove', 'moveUp', 'moveDown']}
                            OnCommand={props.onContextCommand}
                            Tip="针对当前动作项进行操作"
                        />
                    }
                />
            </VerticalBox>
        );
    }
}
