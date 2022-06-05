/* eslint-disable spellcheck/spell-checker */
import { createIntScheme, createVectorScheme } from '../../../../Common/Type';
import { EntityTemplateOp } from '../../../../Game/Common/Operations/EntityTemplate';
import { ISphereFactoryComponent } from '../../../../Game/Interface/Component';
import { createComponentScheme } from './ComponentRegistry';

export const sphereFactorComponentScheme = createComponentScheme<ISphereFactoryComponent>({
    Name: 'SphereFactorComponent',
    Fields: {
        SphereLocation: createVectorScheme({
            CnName: '创建位置',
            ShowName: true,
            NewLine: true,
        }),
        SphereGuid: createIntScheme({
            CnName: '生成模板',
            RenderType: 'entityTemplateId',
            NewLine: true,
            ShowName: true,
            CreateDefault: () => {
                return EntityTemplateOp.GenDefaultId();
            },
        }),
    },
    ShowName: true,
    NoIndent: true,
});
