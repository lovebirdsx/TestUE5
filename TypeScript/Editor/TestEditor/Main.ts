/* eslint-disable spellcheck/spell-checker */
import { argv } from 'puerts';
import { ReactUMGStarter } from 'ue';

import { initCommon } from '../../Common/Init';
import { initGame } from '../../Game/Init';
import { runTestEditor } from './TestEditor';

initCommon();
initGame();
const reactUmgStarter = argv.getByName('ReactUMGStarter') as ReactUMGStarter;
runTestEditor(reactUmgStarter);
