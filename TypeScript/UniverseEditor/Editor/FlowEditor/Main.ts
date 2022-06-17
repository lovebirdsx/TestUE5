/* eslint-disable spellcheck/spell-checker */
import { argv } from 'puerts';
import * as React from 'react';
import { ReactUMGStarter } from 'ue';

import { ReactUMG } from '../../../react-umg/react-umg';
import { initCommon } from '../../Common/Misc/Init';
import { KeyCommands } from '../../Editor/Common/KeyCommands';
import { FlowEditor } from './FlowEditor';

initCommon();
const reactUmgStarter = argv.getByName('ReactUMGStarter') as ReactUMGStarter;
ReactUMG.init(reactUmgStarter);
KeyCommands.Init(ReactUMG.getRoot());
ReactUMG.render(React.createElement(FlowEditor));
