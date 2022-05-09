/* eslint-disable spellcheck/spell-checker */
import { createDefaultTransform, ITransform } from '../../../Common/Interface';
import {
    actionFilterExcept,
    createObjectScheme,
    createStringScheme,
    EActionFilter,
} from '../../../Common/Type';
import { EntityTemplateOp } from '../../Common/Operations/EntityTemplate';
import { ISpawn } from '../../Flow/Action';

const templateGuidScheme = createStringScheme({
    CnName: '实体模板',
    RenderType: 'entityTemplateId',
    CreateDefault: () => {
        return EntityTemplateOp.GenDefaultGuid();
    },
});

const transformScheme = createObjectScheme<ITransform>({
    CnName: '变换',
    CreateDefault: () => {
        return createDefaultTransform();
    },
});

export const spawnScheme = createObjectScheme<ISpawn>({
    CnName: '生成实体',
    Tip: '在对应的位置,生成模板中包含的实体',
    Fields: {
        TemplateGuid: templateGuidScheme,
        Transform: transformScheme,
    },
    Filters: actionFilterExcept(EActionFilter.Invoke),
});
