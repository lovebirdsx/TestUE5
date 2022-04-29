/* eslint-disable spellcheck/spell-checker */
import { argv } from 'puerts';
import { ReactUMGStarter } from 'ue';

import { initCommon } from '../../Common/Init';
import { initEntity } from '../../Game/Entity/Public';
import { runTestEditor } from './TestEditor';

initCommon();
initEntity();
const reactUmgStarter = argv.getByName('ReactUMGStarter') as ReactUMGStarter;
runTestEditor(reactUmgStarter);
