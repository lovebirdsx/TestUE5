/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { IAnyProps } from '../../../../Common/Type';
import { Text } from '../CommonComponent';
import { componentRegistry } from './ComponentRegistry';

export class Any extends React.Component<IAnyProps> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { props } = this;
        const { Type: type } = props;
        if (type.Render) {
            return type.Render(props);
        }

        const reactClass = componentRegistry.Get(type.RrenderType);
        if (reactClass) {
            return React.createElement(reactClass, { ...props });
        }

        return <Text Text={`Not supported value type ${type.RrenderType}`} Color="#FF0000 red" />;
    }
}
