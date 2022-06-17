/* eslint-disable spellcheck/spell-checker */

import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { log } from '../../Common/Misc/Log';
import { ContextBtn, MenuBtn } from '../Common/BaseComponent/ContextBtn';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function TestContextBtn(): JSX.Element {
    return (
        <HorizontalBox>
            <ContextBtn
                Commands={['insert', 'remove', 'moveDown', 'moveUp']}
                OnCommand={(cmd): void => {
                    log(cmd);
                }}
            />
            <MenuBtn
                Name={'Test'}
                Items={[
                    {
                        Name: 'Test1',
                        Fun: (): void => {
                            log('Hello from Test1');
                        },
                    },
                    {
                        Name: 'Test2',
                        Fun: (): void => {
                            log('Hello from Test2');
                        },
                    },
                ]}
            />
        </HorizontalBox>
    );
}
