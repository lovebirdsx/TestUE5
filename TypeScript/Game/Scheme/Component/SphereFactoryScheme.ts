import {
    createObjectScheme,
    createStringScheme,
    createVectorScheme,
    IVectorType,
} from '../../../Common/Type';
import { EntityTemplateOp } from '../../Common/Operations/EntityTemplate';

export interface ISphereFactoryComponent {
    SphereLocation: IVectorType;
    SphereGuid: string;
}

export const sphereFactorComponentScheme = createObjectScheme<ISphereFactoryComponent>({
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
