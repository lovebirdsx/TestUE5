/* eslint-disable spellcheck/spell-checker */
import { createStringScheme, createVectorScheme } from '../../../Common/Type';
import { EntityTemplateOp } from '../../Common/Operations/EntityTemplate';
import { ISphereFactoryComponent } from '../../Interface/Component';
import { createComponentScheme } from './ComponentRegistry';

export const sphereFactorComponentScheme = createComponentScheme<ISphereFactoryComponent>({
    Actions: [],
    Name: 'SphereFactorComponent',
    Fields: {
        SphereLocation: createVectorScheme({
            CnName: '创建位置',
            ShowName: true,
            NewLine: true,
        }),
        SphereGuid: createStringScheme({
            CnName: '生成模板',
            RenderType: 'entityTemplateId',
            NewLine: true,
            ShowName: true,
            CreateDefault: () => {
                return EntityTemplateOp.GenDefaultGuid();
            },
        }),
    },
    ShowName: true,
    NoIndent: true,
});
