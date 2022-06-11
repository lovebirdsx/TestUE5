/* eslint-disable spellcheck/spell-checker */
import { createDefaultTransform, ITransform } from '../../../../Common/Interface';
import { createAssetScheme, createIntScheme, createObjectScheme } from '../../../../Common/Type';
import { EntityTemplateOp } from '../../../../Game/Common/Operations/EntityTemplate';
import { ISpawn } from '../../../../Game/Interface/Action';

const DEFAULT_ENTITY_BP_PATH = '/Game/Blueprints/ExtendedEntity/BP_AiNpcAj.BP_AiNpcAj';

export const entityBpScheme = createAssetScheme({
    CnName: '实体蓝图',
    CreateDefault: () => DEFAULT_ENTITY_BP_PATH,
    SearchPath: '/Game/Blueprints',
    ClassPath: 'Blueprint',
});

export const entityTemplateIdScheme = createIntScheme({
    CnName: '实体模板',
    RenderType: 'entityTemplateId',
    CreateDefault: () => {
        return EntityTemplateOp.GenDefaultId();
    },
});

const transformScheme = createObjectScheme<ITransform>({
    CnName: '变换',
    CreateDefault: () => {
        return createDefaultTransform();
    },
});

export const spawnChildScheme = createObjectScheme<ISpawn>({
    CnName: '生成子实体',
    Tip: '在对应的位置,生成模板中包含的实体',
    Fields: {
        TemplateGuid: entityTemplateIdScheme,
        Transform: transformScheme,
    },
});

export const destroyAllChildScheme = createObjectScheme({
    CnName: '移除所有子实体',
    Tip: '移除所有由当前实体生成的子实体',
});
