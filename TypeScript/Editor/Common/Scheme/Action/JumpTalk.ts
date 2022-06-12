/* eslint-disable spellcheck/spell-checker */
import { IJumpTalk } from '../../../../Game/Interface/IAction';
import { createIntScheme, createObjectScheme } from '../../Type';

export const jumpIdScheme = createIntScheme();

export const jumpTalkScheme = createObjectScheme<IJumpTalk>({
    CnName: '跳转对话',
    Name: 'JumpTalk',
    Fields: {
        TalkId: jumpIdScheme,
    },
    Tip: '跳转到当前状态的对话,跳转后,将继续播放对应的对话',
});

export const finishTalkScheme = createObjectScheme<Record<string, undefined>>({
    CnName: '结束对话',
    Name: 'FinishTalk',
    Tip: '结束当前对话,跳到ShowTalk之后的动作执行',
});
