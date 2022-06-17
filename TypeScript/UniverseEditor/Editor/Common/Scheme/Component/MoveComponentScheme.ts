/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DEFAULT_INIT_SPEED, IMoveComponent } from '../../../../Common/Interface/IComponent';
import { createFloatScheme } from '../../Type';
import { createComponentScheme } from './ComponentRegistry';

export const moveComponentScheme = createComponentScheme<IMoveComponent>({
    Fields: {
        InitSpeed: createFloatScheme({
            CnName: '初始速度',
            NewLine: true,
            ShowName: true,
            CreateDefault: () => DEFAULT_INIT_SPEED,
            Tip: '角色的初始移动速度 (厘米/秒)',
        }),
    },
});
