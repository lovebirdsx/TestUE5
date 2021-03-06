import { IShowCenterText } from '../../../../Common/Interface/IAction';
import { createObjectScheme } from '../../Type';
import { createTextIdScheme } from './ShowTalk';

export const centerTextIdScheme = createTextIdScheme('在屏幕上显示点啥吧!', {
    Name: 'CenterTextId',
    Width: 200,
    Tip: '在屏幕中心显示的内容',
});

export const showCenterTextScheme = createObjectScheme<IShowCenterText>({
    CnName: '显示中间文本',
    Name: 'ShowCenterText',
    Fields: {
        TextId: centerTextIdScheme,
    },
    Scheduled: true,
});
