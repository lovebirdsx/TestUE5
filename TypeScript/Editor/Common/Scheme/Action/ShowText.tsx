import { IShowCenterText } from '../../../../Game/Flow/Action';
import { createObjectScheme } from '../Type';
import { createTextIdScheme } from './ShowTalk';

export const showCenterTextScheme = createObjectScheme<IShowCenterText>(
    {
        TextId: createTextIdScheme('在屏幕上显示点啥吧!', {
            HideName: true,
            Width: 200,
            Tip: '在屏幕中心显示的内容',
        }),
    },
    {
        Scheduled: true,
    },
);
