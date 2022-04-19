import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { log } from '../../../../Common/Log';
import { createStringScheme, emptyObjectScheme, IAnyProps } from '../../../../Common/Type';
import { parsePlayFlow } from '../../../../Game/Flow/Action';
import { Btn, Text } from '../../ReactComponent/CommonComponent';
import { Any } from '../../ReactComponent/Dynamic/Public';
import { playFlowScheme } from '../Action/Public';

function renderFlowJson(name: string, props: IAnyProps): JSX.Element {
    const playFlow = parsePlayFlow(props.Value as string);
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

    // 注意下面只能用Any来渲染,Obj不能正确处理自定义Render的情况
    return (
        <VerticalBox>
            {prefixElement}
            <Any
                Value={playFlow}
                Type={playFlowScheme}
                OnModify={(newFlow, type): void => {
                    props.OnModify(JSON.stringify(newFlow), type);
                }}
            />
        </VerticalBox>
    );
}

export const playFlowJsonScheme = createStringScheme({
    Render: (props) => renderFlowJson('Flow', props),
    CreateDefault: (container): string => {
        return JSON.stringify(parsePlayFlow(''));
    },
    Meta: {
        HideName: true,
        NewLine: true,
    },
});

export const npcScheme = emptyObjectScheme;
