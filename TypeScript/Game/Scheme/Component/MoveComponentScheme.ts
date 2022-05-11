/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createFloatScheme, createObjectScheme } from '../../../Common/Type';
import { DEFAULT_INIT_SPEED, IMoveComponent } from '../../Interface';

export const moveComponentScheme = createObjectScheme<IMoveComponent>({
    Fields: {
        InitSpeed: createFloatScheme({
            CnName: '初始速度',
            Optional: true,
            NewLine: true,
            ShowName: true,
            CreateDefault: () => DEFAULT_INIT_SPEED,
            Tip: '角色的初始移动速度 (厘米/秒)',
        }),
    },
});
