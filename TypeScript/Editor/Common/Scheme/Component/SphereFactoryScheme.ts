/* eslint-disable spellcheck/spell-checker */
import { EntityTemplateOp } from '../../../../Game/Common/Operations/EntityTemplate';
import { ISphereFactoryComponent } from '../../../../Game/Interface/IComponent';
import { createIntScheme, createVectorScheme } from '../../Type';
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
