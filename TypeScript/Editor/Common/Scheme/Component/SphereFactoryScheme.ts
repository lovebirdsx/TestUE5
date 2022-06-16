/* eslint-disable spellcheck/spell-checker */
import { ISphereFactoryComponent } from '../../../../Common/Interface/IComponent';
import { entityTemplateManager } from '../../EntityTemplateManager';
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
                return entityTemplateManager.GenDefaultId();
            },
        }),
    },
    ShowName: true,
    NoIndent: true,
});
