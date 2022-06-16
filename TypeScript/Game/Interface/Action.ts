/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-param-reassign */
import { Quat, Rotator, Transform, Vector } from 'ue';

import { alignNumber } from '../../Common/Misc/Util';
import { IFlowInfo, IPlayFlow, IPosA, ITransform, IVectorInfo } from './IAction';

export const defaultVec: IVectorInfo = { X: 0, Y: 0, Z: 0 };

export function toVector(iVec: IVectorInfo, defalut?: IVectorInfo): Vector {
    // eslint-disable-next-line no-param-reassign
    defalut = defalut || defaultVec;
    if (!iVec) {
        // eslint-disable-next-line no-param-reassign
        iVec = defalut;
    }

    return new Vector(iVec.X || defalut.X, iVec.Y || defalut.Y, iVec.Z || defalut.Z);
}

// 比较两个number, 返回是否大约相等, 通常用于比较浮点数
export function eqn(a: number, b: number): boolean {
    const sub = a - b;
    const ab = sub > 0 ? sub : -sub;
    return ab < 0.0001;
}

// 将number转换位精确到1/100的浮点型
function toFloat(n: number): number {
    return Math.round(n * 100) / 100;
}

export function toVectorInfo(vec: Vector, defalut?: IVectorInfo): IVectorInfo {
    // eslint-disable-next-line no-param-reassign
    defalut = defalut || defaultVec;

    const x = eqn(vec.X, defalut.X) ? undefined : toFloat(vec.X);
    const y = eqn(vec.Y, defalut.Y) ? undefined : toFloat(vec.Y);
    const z = eqn(vec.Z, defalut.Z) ? undefined : toFloat(vec.Z);

    if (x === undefined && y === undefined && z === undefined) {
        return undefined;
    }

    return { X: x, Y: y, Z: z };
}

export const defalutRot: IVectorInfo = { X: 0, Y: 0, Z: 0 };
export function toRotation(rot: IVectorInfo): Rotator {
    return Rotator.MakeFromEuler(toVector(rot, defalutRot));
}

export function toRotationInfo(rot: Rotator): IVectorInfo {
    return toVectorInfo(rot.Euler(), defalutRot);
}

export function toRotationInfoQuat(rot: Quat): IVectorInfo {
    return toVectorInfo(rot.Euler(), defalutRot);
}

export const defalutScale: IVectorInfo = { X: 1, Y: 1, Z: 1 };
export function toScale(scale: IVectorInfo): Vector {
    return toVector(scale, defalutScale);
}

export function toScaleInfo(scale: Vector): IVectorInfo {
    return toVectorInfo(scale, defalutScale);
}

export function createDefaultTransform(): ITransform {
    return {
        Pos: defaultVec,
    };
}

export function toTransform(transform: ITransform): Transform {
    return new Transform(
        toRotation(transform.Rot),
        toVector(transform.Pos),
        toScale(transform.Scale),
    );
}

export function toTransformInfo(transform: Transform): ITransform {
    return {
        Pos: toVectorInfo(transform.GetLocation()),
        Rot: toRotationInfoQuat(transform.GetRotation()),
        Scale: toScaleInfo(transform.GetScale3D()),
    };
}

export const defalutPosA: IPosA = { X: 0, Y: 0, Z: 0, A: 0 };

export function toPosA(vec: Vector, angle: number | undefined): IPosA {
    return {
        ...toVectorInfo(vec),
        A: angle,
    };
}

export function angleToRotation(angle: number): Rotator {
    return Rotator.MakeFromEuler(new Vector(0, 0, angle));
}

export function posaToTransform(posA: IPosA): Transform {
    posA = posA || defalutPosA;
    return new Transform(angleToRotation(posA.A || 0), toVector(posA), toVector(defalutScale));
}

export function transformToPosA(transfom: Transform): IPosA {
    return {
        ...toVectorInfo(transfom.GetLocation()),
        A: transfom.GetRotation().Euler().Z,
    };
}

export function alignVector(vec: IVectorInfo, len = 1): void {
    if (!vec) {
        return;
    }

    if (vec.X) {
        vec.X = Math.floor(vec.X / len) * len;
    }

    if (vec.Y) {
        vec.Y = Math.floor(vec.Y / len) * len;
    }

    if (vec.Z) {
        vec.Z = Math.floor(vec.Z / len) * len;
    }
}

export function alignPosA(posA: IPosA, len = 1): void {
    alignVector(posA);
    posA.A = alignNumber(posA.A);
}

export function parseFlowInfo(json: string): IFlowInfo {
    if (!json) {
        return {
            Id: 0,
            Name: 'Flow',
            States: [],
        };
    }

    return JSON.parse(json) as IFlowInfo;
}

export function parsePlayFlow(json: string): IPlayFlow {
    if (!json) {
        return {
            FlowListName: '',
            FlowId: 0,
            StateId: 0,
        };
    }

    return JSON.parse(json) as IPlayFlow;
}
