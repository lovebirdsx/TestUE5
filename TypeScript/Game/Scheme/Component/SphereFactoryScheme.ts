/* eslint-disable spellcheck/spell-checker */
import { createStringScheme, createVectorScheme, IVectorType } from '../../../Common/Type';
import { EntityTemplateOp } from '../../Common/Operations/EntityTemplate';
import { createComponentScheme } from './ComponentRegistry';

export interface ISphereFactoryComponent {
    SphereLocation: IVectorType;
    SphereGuid: string;
}

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
