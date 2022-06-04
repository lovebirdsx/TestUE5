import { createAssetScheme, createBooleanScheme, createObjectScheme } from '../../../Common/Type';
import { ISetHeadIconVisible } from '../../Interface/Action';
import { talkerIdScheme } from './ShowTalk';

const DEFAULT_TEXTURE_PATH = '/Textures/J_01.J_01';

export const headIconScheme = createAssetScheme({
    CreateDefault: () => DEFAULT_TEXTURE_PATH,
    SearchPath: 'Textures',
    ClassPath: `Texture2D`,
});

export const setHeadIconVisibleScheme = createObjectScheme<ISetHeadIconVisible>({
    CnName: '设定头像是否可见',
    Fields: {
        WhoId: talkerIdScheme,
        Visible: createBooleanScheme({
            Tip: '是否显示头像',
        }),
    },
});
