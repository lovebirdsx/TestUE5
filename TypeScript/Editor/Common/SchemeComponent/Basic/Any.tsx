/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { TColor } from '../../../../Common/Color';
import { IProps } from '../../../../Common/Type';
import { Text } from '../../BaseComponent/CommonComponent';
import { renderRegistry } from '../RenderRegistry';
import { componentRegistry } from './ComponentRegistry';

export class Any extends React.Component<IProps & { Color?: TColor }> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { props } = this;
        const scheme = props.Scheme;

        const component = renderRegistry.GetComponent(props.Scheme);
        if (component) {
            return React.createElement(component, { ...props });
        }

        const reactClass = componentRegistry.Get(scheme.RenderType);
        if (reactClass) {
            return React.createElement(reactClass, { ...props });
        }

        return <Text Text={`Not supported value type ${scheme.RenderType}`} Color="#FF0000 red" />;
    }
}
