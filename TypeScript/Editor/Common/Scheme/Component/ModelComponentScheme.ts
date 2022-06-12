import { IModelComponent } from '../../../../Game/Interface/IComponent';
import { createStringScheme } from '../../Type';
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
