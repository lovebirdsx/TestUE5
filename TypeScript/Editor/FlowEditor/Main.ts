/* eslint-disable spellcheck/spell-checker */
import { argv } from 'puerts';
import * as React from 'react';
import { ReactUMGStarter } from 'ue';

import { KeyCommands } from '../../Editor/Common/KeyCommands';
import { ReactUMG } from '../../react-umg/react-umg';
import { FlowEditor } from './FlowEditor';

const reactUmgStarter = argv.getByName('ReactUMGStarter') as ReactUMGStarter;
ReactUMG.init(reactUmgStarter);
KeyCommands.Init(ReactUMG.getRoot());
ReactUMG.render(React.createElement(FlowEditor));
