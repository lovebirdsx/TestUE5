import { Quat, Rotator, Transform, Vector } from 'ue';

/* eslint-disable spellcheck/spell-checker */
export interface IVectorInfo {
    X?: number;
    Y?: number;
    Z?: number;
}

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

export function toVectorInfo(vec: Vector, defalut?: IVectorInfo): IVectorInfo {
    // eslint-disable-next-line no-param-reassign
    defalut = defalut || defaultVec;

    const x = vec.X === defaultVec.X ? undefined : vec.X;
    const y = vec.Y === defaultVec.Y ? undefined : vec.Y;
    const z = vec.Z === defaultVec.Z ? undefined : vec.Z;

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

export interface ITransform {
    Pos: IVectorInfo;
    Rot?: IVectorInfo;
    Scale?: IVectorInfo;
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
        Scale: toScale(transform.GetScale3D()),
    };
}
