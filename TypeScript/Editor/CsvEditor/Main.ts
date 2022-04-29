/* eslint-disable spellcheck/spell-checker */
import { argv } from 'puerts';
import * as React from 'react';
import { ReactUMGStarter } from 'ue';

import { initCommon } from '../../Common/Init';
import { KeyCommands } from '../../Editor/Common/KeyCommands';
import { initEntity } from '../../Game/Entity/Public';
import { ReactUMG } from '../../react-umg/react-umg';
import { CsvEditor } from './CsvEditor';

initCommon();
initEntity();
const reactUmgStarter = argv.getByName('ReactUMGStarter') as ReactUMGStarter;
ReactUMG.init(reactUmgStarter);
KeyCommands.Init(ReactUMG.getRoot());
ReactUMG.render(React.createElement(CsvEditor));
