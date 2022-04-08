/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { IAnyProps } from '../Scheme';
import { Array } from './Array';
import { Asset, Bool, Enum, Float, Int, String } from './Basic';
import { Text } from './CommonComponent';
import { Dynamic } from './Dynamic';
import { Obj } from './Obj';

export class Any extends React.Component<IAnyProps> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { props } = this;
        const { Type: type } = props;
        if (type.Render) {
            return type.Render(props);
        }

        switch (type.RrenderType) {
            case 'boolean':
                return <Bool {...props} />;
            case 'int':
                return <Int {...props} />;
            case 'float':
                return <Float {...props} />;
            case 'string':
                return <String {...props} />;
            case 'asset':
                return <Asset {...props} />;
            case 'enum':
                return <Enum {...props} />;
            case 'object':
                return <Obj {...props} />;
            case 'array':
                return <Array {...props} />;
            case 'dynamic':
                return <Dynamic {...props} />;
            default:
                return (
                    <Text
                        Text={`Not supported value type ${type.RrenderType}`}
                        Color="#FF0000 red"
                    />
                );
        }
    }
}
