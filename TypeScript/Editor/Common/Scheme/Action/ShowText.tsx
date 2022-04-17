import { createObjectScheme, EObjectFilter, objectFilterExcept } from '../../../../Common/Type';
import { IShowCenterText } from '../../../../Game/Flow/Action';
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
        Filters: objectFilterExcept(EObjectFilter.Trigger),
    },
);
