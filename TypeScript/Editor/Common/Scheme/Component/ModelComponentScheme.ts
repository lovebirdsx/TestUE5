import { createStringScheme } from '../../../../Common/Type';
import { IModelComponent } from '../../../../Game/Interface/Component';
import { createComponentScheme } from './ComponentRegistry';

export const meshScheme = createStringScheme({
    CnName: `网格体路径`,
    ShowName: true,
    NewLine: true,
    CreateDefault: () => '',
});

export const animScheme = createStringScheme({
    CnName: `动画蓝图`,
    ShowName: true,
    NewLine: true,
    CreateDefault: () => '',
});

export const modelComponentScheme = createComponentScheme<IModelComponent>({
    Name: 'modelComponentScheme',
    Fields: {
        MeshClass: meshScheme,
        AnimClass: animScheme,
    },
    NewLine: true,
});
