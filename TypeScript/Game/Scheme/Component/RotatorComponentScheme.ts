/* eslint-disable spellcheck/spell-checker */
import {
    createObjectScheme,
    createStringScheme,
    createVectorScheme,
    IVectorType,
} from '../../../Common/Type';

export interface IRotatorComponent {
    RotatorSpeed: IVectorType;
    LocationOffset: IVectorType;
    RotationOffset: IVectorType;
    EntityId: string;
}

export const rotatorComponentScheme = createObjectScheme<IRotatorComponent>({
    Name: 'RotatorComponent',
    Fields: {
        RotatorSpeed: createVectorScheme({
            CnName: '旋转速度',
            ShowName: true,
            NewLine: true,
            Tip: '设定单个轴旋转时的速度',
            CreateDefault(): IVectorType {
                return {
                    X: 1,
                    Y: 1,
                    Z: 0,
                };
            },
        }),
        LocationOffset: createVectorScheme({
            CnName: '摄像机位置偏移',
            ShowName: true,
            NewLine: true,
            Tip: '视角平移偏移',
        }),
        RotationOffset: createVectorScheme({
            CnName: '摄像机旋转偏移',
            ShowName: true,
            NewLine: true,
            Tip: '视角旋转偏移',
        }),
        EntityId: createStringScheme({
            CnName: '旋转目标',
            RenderType: 'entityId',
            ShowName: true,
            NewLine: true,
        }),
    },
    NewLine: true,
});
