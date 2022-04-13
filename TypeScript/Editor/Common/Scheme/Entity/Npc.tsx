import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import TsNpc from '../../../../Game/Entity/TsNpc';
import { parseFlowInfo } from '../../../../Game/Flow/Action';
import { Btn, Text } from '../../Component/CommonComponent';
import { Flow } from '../../Component/Flow';
import { log } from '../../Log';
import { createObjectSchemeForUeClass, createStringScheme, IAnyProps } from '../Type';

function renderFlowJson(name: string, props: IAnyProps): JSX.Element {
    const flow = parseFlowInfo(props.Value as string);
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
        <VerticalBox>
            {prefixElement}
            <Flow
                Flow={flow}
                OnModify={(newFlow, type): void => {
                    props.OnModify(JSON.stringify(newFlow), type);
                }}
            />
        </VerticalBox>
    );
}

export const flowJsonScheme = createStringScheme({
    Render: (props) => renderFlowJson('TriggerActionsJson', props),
    Meta: {
        HideName: true,
        NewLine: true,
    },
});

export const npcScheme = createObjectSchemeForUeClass<TsNpc>({
    FlowJson: flowJsonScheme,
});
