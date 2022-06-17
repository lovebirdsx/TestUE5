/* eslint-disable spellcheck/spell-checker */
import { IVectorInfo } from '../../../../Common/Interface/IAction';
import { IEventRotator, IRotatorComponent } from '../../../../Common/Interface/IComponent';
import {
    createArrayScheme,
    createBooleanScheme,
    createIntScheme,
    createObjectScheme,
    createVectorScheme,
} from '../../Type';
import { trampleActionScheme } from '../Action/Action';
import { createComponentScheme } from './ComponentRegistry';
import { interactiveComponentFields } from './InteractComponentScheme';

export const eventScheme = createObjectScheme<IEventRotator>({
    Name: 'eventScheme',
    Fields: {
        StartActions: createArrayScheme({
            CnName: `开始事件`,
            ShowName: true,
            NewLine: true,
            Element: trampleActionScheme,
        }),
        EndActions: createArrayScheme({
            CnName: `退出事件`,
            ShowName: true,
            NewLine: true,
            Element: trampleActionScheme,
        }),
    },
    NewLine: true,
    NoIndent: true,
});

export const rotatorComponentScheme = createComponentScheme<IRotatorComponent>({
    Name: 'RotatorComponent',
    Fields: {
        ...interactiveComponentFields,
        RotatorSpeed: createVectorScheme({
            CnName: '旋转速度(/100)',
            ShowName: true,
            NewLine: true,
            Tip: '设定单个轴旋转时的速度',
            CreateDefault(): IVectorInfo {
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
            Tip: '调整鼠标的竖直和横向移动调整哪个轴',
            CreateDefault(): IVectorInfo {
                return {
                    X: 1,
                    Y: 2,
                    Z: 0,
                };
            },
        }),
        EntityId: createIntScheme({
            CnName: '旋转目标',
            RenderType: 'entityId',
            ShowName: true,
            NewLine: true,
        }),
        IsLocalSpace: createBooleanScheme({
            CnName: '本地空间旋转',
            RenderType: 'boolean',
            ShowName: true,
            NewLine: true,
        }),
        IsRotatorSelf: createBooleanScheme({
            CnName: '是否旋转自己',
            RenderType: 'boolean',
            ShowName: true,
            NewLine: true,
        }),
        IsLockZ: createBooleanScheme({
            CnName: '是否锁Z轴',
            RenderType: 'boolean',
            ShowName: true,
            NewLine: true,
            Tip: '开启后旋转时物体的Z不会旋转，并且有旋转范围限定',
        }),
        IsRecovery: createBooleanScheme({
            CnName: '结束后是否恢复旋转',
            RenderType: 'boolean',
            ShowName: true,
            NewLine: true,
        }),
        InteractAction: eventScheme,
    },
    NewLine: true,
});
