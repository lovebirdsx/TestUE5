import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { log } from '../../../../Common/Log';
import {
    createArrayScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
    EActionFilter,
    IProps,
    TModifyType,
} from '../../../../Common/Type';
import { ITsTrigger } from '../../../../Game/Entity/Interface';
import { ITriggerActions, parseTriggerActionsJson } from '../../../../Game/Flow/Action';
import { Btn, Text } from '../../BaseComponent/CommonComponent';
import { Obj } from '../../SchemeComponent/Basic/Public';
import { actionRegistry } from '../Action/Public';

export const actionsScheme = createObjectScheme<ITriggerActions>({
    Actions: createArrayScheme({
        Element: actionRegistry.GetActionScheme(EActionFilter.Trigger),
        Meta: {
            HideName: true,
            NewLine: true,
        },
    }),
});

function renderActionJson(name: string, props: IProps): JSX.Element {
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
            Scheme={actionsScheme}
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
