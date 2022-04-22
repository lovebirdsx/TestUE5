import { actionFilterExcept, createObjectScheme, EActionFilter } from '../../../../Common/Type';
import { IShowCenterText } from '../../../../Game/Flow/Action';
import { createTextIdScheme } from './ShowTalk';

export const centerTextIdScheme = createTextIdScheme('在屏幕上显示点啥吧!', {
    Width: 200,
    Tip: '在屏幕中心显示的内容',
});

export const showCenterTextScheme = createObjectScheme<IShowCenterText>(
    {
        TextId: centerTextIdScheme,
    },
    {
        Scheduled: true,
        Filters: actionFilterExcept(EActionFilter.Trigger),
    },
);
