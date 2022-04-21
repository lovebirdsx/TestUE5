/* eslint-disable spellcheck/spell-checker */
import { EActionFilter, IntScheme, ObjectScheme, TObjectFields } from '../../../../Common/Type';
import { IJumpTalk } from '../../../../Game/Flow/Action';

export class JumpTalkIdScheme extends IntScheme {}

export class JumpTalkScheme extends ObjectScheme<IJumpTalk> {
    public Fields: TObjectFields<IJumpTalk> = {
        TalkId: new JumpTalkIdScheme(),
    };

    public Filters: EActionFilter[] = [EActionFilter.Talk];

    public Tip?: string = '跳转到当前状态的对话,跳转后,将继续播放对应的对话';
}

export class FinishTalkScheme extends ObjectScheme<Record<string, undefined>> {
    public Fields: TObjectFields<Record<string, undefined>> = {};

    public Filters = [EActionFilter.Talk];

    public Tip = '结束当前对话,跳到ShowTalk之后的动作执行';
}
