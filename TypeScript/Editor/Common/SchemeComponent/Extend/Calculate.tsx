/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react';

import { TColor } from '../../../../Common/Color';
import { IProps } from '../../../../Common/Type';
import { TVar } from '../../../../Game/Interface/Action';
import { EditorBox } from '../../BaseComponent/CommonComponent';

export function RenderVarValue(props: IProps<TVar> & { Color?: TColor }): JSX.Element {
    return (
        <EditorBox
            Text={props.Value !== undefined ? props.Value.toString() : ''}
            Color={props.Color}
            Width={props.Scheme.Width}
            MaxWidth={props.Scheme.MaxWidth}
            Tip={'若填入数字, 则直接使用数值, 若填入字符串, 则使用字符串对应的变量'}
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
