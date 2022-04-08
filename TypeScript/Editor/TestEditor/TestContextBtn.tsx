/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import { VerticalBox } from 'react-umg';

import { ContextBtn } from '../../Editor/Common/Component/ContextBtn';
import { log } from '../Common/Log';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function TestContextBtn(): JSX.Element {
    return (
        <VerticalBox>
            <ContextBtn
                Commands={['insert', 'remove', 'moveDown', 'moveUp']}
                OnCommand={(cmd): void => {
                    log(cmd);
                }}
            />
        </VerticalBox>
    );
}
