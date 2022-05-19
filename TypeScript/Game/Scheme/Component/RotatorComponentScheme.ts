/* eslint-disable spellcheck/spell-checker */
import {
    createArrayScheme,
    createBooleanScheme,
    createObjectScheme,
    createObjectSchemeForComponent,
    createStringScheme,
    createVectorScheme,
    EActionFilter,
    IVectorType,
} from '../../../Common/Type';
import { IActionInfo } from '../../Flow/Action';
import { IInteractiveComponent } from '../../Interface';
import { actionRegistry } from '../Action/Public';
import { interactiveComponentFields } from './InteractComponentScheme';

export interface IEventRotator {
    StartActions: IActionInfo[];
    EndActions: IActionInfo[];
}

export interface IRotatorComponent extends IInteractiveComponent {
    RotatorSpeed: IVectorType;
    LocationOffset: IVectorType;
    RotationOffset: IVectorType;
    RotationMapping: IVectorType;
    IsLocalSpace: boolean;
    EntityId: string;
    IsRotatorSelf: boolean;
    InteractAction: IEventRotator;
}

export const eventScheme = createObjectScheme<IEventRotator>({
    Name: 'eventScheme',
    Fields: {
        StartActions: createArrayScheme({
            CnName: `开始事件`,
            ShowName: true,
            NewLine: true,
            Element: actionRegistry.GetActionScheme(EActionFilter.Trample),
        }),
        EndActions: createArrayScheme({
            CnName: `退出事件`,
            ShowName: true,
            NewLine: true,
            Element: actionRegistry.GetActionScheme(EActionFilter.Trample),
        }),
    },
    NewLine: true,
    NoIndent: true,
});

export const rotatorComponentScheme = createObjectSchemeForComponent<IRotatorComponent>({
    Name: 'RotatorComponent',
    Fields: {
        ...interactiveComponentFields,
        RotatorSpeed: createVectorScheme({
            CnName: '旋转速度(/100)',
            ShowName: true,
            NewLine: true,
            Tip: '设定单个轴旋转时的速度',
            CreateDefault(): IVectorType {
                return {
                    X: 100,
                    Y: 100,
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
        RotationMapping: createVectorScheme({
            CnName: '旋转控制轴映射',
            ShowName: true,
            NewLine: true,
            Tip: '调整a/d, w/s 时旋转物体哪个轴，a/d旋转的轴为1， w/s旋转的轴为2',
            CreateDefault(): IVectorType {
                return {
                    X: 1,
                    Y: 2,
                    Z: 0,
                };
            },
        }),
        IsLocalSpace: createBooleanScheme({
            CnName: '本地空间旋转',
            RenderType: 'boolean',
            ShowName: true,
            NewLine: true,
        }),
        EntityId: createStringScheme({
            CnName: '旋转目标',
            RenderType: 'entityId',
            ShowName: true,
            NewLine: true,
        }),
        IsRotatorSelf: createBooleanScheme({
            CnName: '是否旋转自己',
            RenderType: 'boolean',
            ShowName: true,
            NewLine: true,
        }),
        InteractAction: eventScheme,
    },
    NewLine: true,
});
