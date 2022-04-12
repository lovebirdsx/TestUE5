import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import TsTrigger from '../../../../Game/Entity/TsTrigger';
import { ITriggerActions, parseTriggerActionsJson } from '../../../../Game/Flow/Action';
import { Btn, Text } from '../../Component/CommonComponent';
import { Obj } from '../../Component/Obj';
import { log } from '../../Log';
import {
    createArrayScheme,
    createIntScheme,
    createObjectScheme,
    createObjectSchemeForUeClass,
    createStringScheme,
    IAnyProps,
    normalActionScheme,
    TModifyType,
} from '../Action';

export const actionsScheme = createObjectScheme<ITriggerActions>({
    Actions: createArrayScheme({
        Element: normalActionScheme,
        Meta: {
            HideName: true,
            NewLine: true,
        },
    }),
});

function renderActionJson(name: string, props: IAnyProps): JSX.Element {
    const actions = parseTriggerActionsJson(props.Value as string);
    const prefixElement = (
        <HorizontalBox>
            <Text Text={name} />
            <Btn
                Text={'R'}
                OnClick={(): void => {
                    props.OnModify('', 'normal');
                }}
            />
            <Btn
                Text={'P'}
                OnClick={(): void => {
                    log(props.Value as string);
                }}
            />
        </HorizontalBox>
    );
    return (
        <Obj
            PrefixElement={prefixElement}
            Value={actions}
            Type={actionsScheme}
            OnModify={(obj: unknown, type: TModifyType): void => {
                props.OnModify(JSON.stringify(obj), type);
            }}
        />
    );
}

export const actionsJsonScheme = createStringScheme({
    Render: (props) => renderActionJson('TriggerActionsJson', props),
    Meta: {
        HideName: true,
        NewLine: true,
    },
});

export const triggerScheme = createObjectSchemeForUeClass<TsTrigger>({
    MaxTriggerTimes: createIntScheme({
        Meta: {
            NewLine: true,
        },
    }),
    TriggerActionsJson: actionsJsonScheme,
});
