/* eslint-disable spellcheck/spell-checker */
import { createIntScheme, createObjectScheme, EActionFilter } from '../../../../Common/Type';
import { IJumpTalk } from '../../../../Game/Flow/Action';

export const jumpIdScheme = createIntScheme();

export const jumpTalkScheme = createObjectScheme<IJumpTalk>({
    Name: 'JumpTalk',
    Fields: {
        TalkId: jumpIdScheme,
    },
    Filters: [EActionFilter.Talk],
    Tip: '跳转到当前状态的对话,跳转后,将继续播放对应的对话',
});

export const finishTalkScheme = createObjectScheme<Record<string, undefined>>({
    Name: 'FinishTalk',
    Filters: [EActionFilter.Talk],
    Tip: '结束当前对话,跳到ShowTalk之后的动作执行',
});
