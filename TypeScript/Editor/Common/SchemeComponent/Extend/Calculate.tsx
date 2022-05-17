/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react';

import { TColor } from '../../../../Common/Color';
import { IProps } from '../../../../Common/Type';
import { TVar } from '../../../../Game/Flow/Action';
import { EditorBox } from '../../BaseComponent/CommonComponent';

export function RenderVarValue(props: IProps<TVar> & { Color?: TColor }): JSX.Element {
    return (
        <EditorBox
            Text={props.Value !== undefined ? props.Value.toString() : ''}
            Color={props.Color}
            OnChange={function (text: string): void {
                const num = Number(text);
                if (isNaN(num)) {
                    props.OnModify(text, 'normal');
                } else {
                    props.OnModify(num, 'normal');
                }
            }}
        />
    );
}
