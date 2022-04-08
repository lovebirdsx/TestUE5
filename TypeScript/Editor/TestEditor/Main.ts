/* eslint-disable spellcheck/spell-checker */
import { argv } from 'puerts';
import { ReactUMGStarter } from 'ue';

import { runTestEditor } from './TestEditor';

const reactUmgStarter = argv.getByName('ReactUMGStarter') as ReactUMGStarter;
runTestEditor(reactUmgStarter);
