/* eslint-disable spellcheck/spell-checker */
import {
    createObjectSchemeForComponent,
    createStringScheme,
    createVectorScheme,
    IVectorType,
} from '../../../Common/Type';
import { EntityTemplateOp } from '../../Common/Operations/EntityTemplate';

export interface ISphereFactoryComponent {
    SphereLocation: IVectorType;
    SphereGuid: string;
}

export const sphereFactorComponentScheme = createObjectSchemeForComponent<ISphereFactoryComponent>({
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
