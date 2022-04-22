import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { log } from '../../../../Common/Log';
import { createStringScheme, emptyObjectScheme, IProps } from '../../../../Common/Type';
import { parsePlayFlow } from '../../../../Game/Flow/Action';
import { Btn, Text } from '../../BaseComponent/CommonComponent';
import { Any } from '../../SchemeComponent/Basic/Public';
import { playFlowScheme } from '../Action/Public';

function renderFlowJson(name: string, props: IProps): JSX.Element {
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
                Scheme={playFlowScheme}
                OnModify={(newFlow, type): void => {
                    props.OnModify(JSON.stringify(newFlow), type);
                }}
            />
        </VerticalBox>
    );
}

export const playFlowJsonScheme = createStringScheme({
    NewLine: true,
    Render: (props) => renderFlowJson('Flow', props),
    CreateDefault: (): string => {
        return JSON.stringify(parsePlayFlow(''));
    },
});

export const npcScheme = emptyObjectScheme;
