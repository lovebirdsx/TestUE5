/* eslint-disable spellcheck/spell-checker */
import { BooleanScheme, FloatScheme, IntScheme, StringScheme } from '../../../Common/Type';
import { IChangeState, IJumpTalk } from '../../../Game/Flow/Action';
import { FinishTalkScheme, JumpTalkIdScheme, JumpTalkScheme } from '../Scheme/Action/JumpTalk';
import { ChangeStateScheme, StateIdScheme } from '../Scheme/Action/State';
import { Bool, Float, Int, String } from './Basic/Basic';
import { Obj } from './Basic/Obj';
import { RenderStateId } from './Flow/State';
import { renderRegistry } from './RenderRegistry';
import { RenderJumpTalkId } from './Talk/JumpTalk';

renderRegistry.RegComponent<number>(FloatScheme, Float);
renderRegistry.RegComponent<boolean>(BooleanScheme, Bool);
renderRegistry.RegComponent<string>(StringScheme, String);
renderRegistry.RegComponent<number>(IntScheme, Int);
renderRegistry.RegComponent<number>(JumpTalkIdScheme, RenderJumpTalkId);
renderRegistry.RegComponent<number>(StateIdScheme, RenderStateId);
renderRegistry.RegObjComponent<IJumpTalk>(JumpTalkScheme, Obj);
renderRegistry.RegObjComponent<Record<string, unknown>>(FinishTalkScheme, Obj);
renderRegistry.RegObjComponent<IChangeState>(ChangeStateScheme, Obj);

export * from './Basic/Public';
