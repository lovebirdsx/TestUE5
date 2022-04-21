/* eslint-disable spellcheck/spell-checker */
import { jumpIdScheme } from '../Scheme/Action/JumpTalk';
import { renderRegistry } from './RenderRegistry';
import { RenderJumpTalkId } from './Talk/JumpTalk';

renderRegistry.RegComponent<number>(jumpIdScheme, RenderJumpTalkId);

export * from './Basic/Public';
