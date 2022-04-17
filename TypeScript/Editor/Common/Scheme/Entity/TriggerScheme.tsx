import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { log } from '../../../../Common/Log';
import {
    createArrayScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
    EObjectFilter,
    IAnyProps,
    TModifyType,
} from '../../../../Common/Type';
import { ITsTrigger } from '../../../../Game/Entity/Interface';
import { ITriggerActions, parseTriggerActionsJson } from '../../../../Game/Flow/Action';
import { Btn, Text } from '../../ReactComponent/CommonComponent';
import { Obj } from '../../ReactComponent/Dynamic';
import { actionRegistry } from '../Action';

export const actionsScheme = createObjectScheme<ITriggerActions>({
    Actions: createArrayScheme({
        Element: actionRegistry.GetDynamicObjectScheme(EObjectFilter.Trigger),
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

export const triggerScheme = createObjectScheme<ITsTrigger>({
    MaxTriggerTimes: createIntScheme({
        Meta: {
            NewLine: true,
        },
    }),
    TriggerActionsJson: actionsJsonScheme,
});
