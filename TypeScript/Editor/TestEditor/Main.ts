/* eslint-disable spellcheck/spell-checker */
import { argv } from 'puerts';
import { ReactUMGStarter } from 'ue';

import { globalInit } from '../../Common/Init';
import { runTestEditor } from './TestEditor';

globalInit();
const reactUmgStarter = argv.getByName('ReactUMGStarter') as ReactUMGStarter;
runTestEditor(reactUmgStarter);
