/* eslint-disable spellcheck/spell-checker */
import { BooleanScheme, FloatScheme, IntScheme, StringScheme } from '../../../Common/Type';
import { IJumpTalk } from '../../../Game/Flow/Action';
import { JumpTalkIdScheme, JumpTalkScheme } from '../Scheme/Action/JumpTalk';
import { Bool, Float, Int, String } from './Basic/Basic';
import { Obj } from './Basic/Obj';
import { renderRegistry } from './RenderRegistry';
import { RenderJumpTalkId } from './Talk/JumpTalk';

renderRegistry.RegComponent<number>(FloatScheme, Float);
renderRegistry.RegComponent<boolean>(BooleanScheme, Bool);
renderRegistry.RegComponent<string>(StringScheme, String);
renderRegistry.RegComponent<number>(IntScheme, Int);
renderRegistry.RegComponent<number>(JumpTalkIdScheme, RenderJumpTalkId);
renderRegistry.RegObjComponent<IJumpTalk>(JumpTalkScheme, Obj);

export * from './Basic/Public';
