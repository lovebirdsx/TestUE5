/* eslint-disable spellcheck/spell-checker */
import {
    actionFilterExcept,
    createObjectScheme,
    createStringScheme,
    EActionFilter,
} from '../../../Common/Type';
import { EntityTemplateOp } from '../../Common/Operations/EntityTemplate';
import { ISpawn, ITransform } from '../../Flow/Action';

const templateGuidScheme = createStringScheme({
    CnName: '实体模板',
    RenderType: 'entityTemplateId',
    CreateDefault: () => {
        return EntityTemplateOp.GenDefaultGuid();
    },
});

const transformScheme = createObjectScheme<ITransform>({
    CnName: '变换',
});

export const spawnScheme = createObjectScheme<ISpawn>({
    CnName: '生成实体',
    Fields: {
        TemplateGuid: templateGuidScheme,
        Transform: transformScheme,
    },
    Filters: actionFilterExcept(EActionFilter.Invoke),
});
