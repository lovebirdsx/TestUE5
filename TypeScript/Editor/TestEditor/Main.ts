/* eslint-disable spellcheck/spell-checker */
import { argv } from 'puerts';
import { ReactUMGStarter } from 'ue';

import { initCommon } from '../../Common/Misc/Init';
import { runTestEditor } from './TestEditor';

initCommon();
const reactUmgStarter = argv.getByName('ReactUMGStarter') as ReactUMGStarter;
runTestEditor(reactUmgStarter);
