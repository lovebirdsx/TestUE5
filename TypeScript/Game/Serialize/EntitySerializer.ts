/* eslint-disable spellcheck/spell-checker */

import { GameplayStatics, Rotator, Transform, Vector } from 'ue';

import { getBlueprintId, getBlueprintType } from '../../Common/Class';
import { error } from '../../Common/Log';
import StateComponent from '../Component/StateComponent';
import { TsEntity } from '../Entity/Public';
import { IEntityState, IGameContext, IPlayerState, ITsEntity, ITsPlayer } from '../Interface';
import { entitySchemeRegistry } from '../Scheme/Entity/Public';

function vectorToArray(vec: Vector): number[] {
    return [vec.X, vec.Y, vec.Z];
}

function arrayToVector(array: number[]): Vector {
    return new Vector(array[0], array[1], array[2]);
}

function genRotationArray(vec: Vector): number[] {
    if (vec.X === 0 && vec.Y === 0 && vec.Z === 0) {
        return undefined;
    }

    return vectorToArray(vec);
}

function genScaleArray(vec: Vector): number[] {
    if (vec.X === 1 && vec.Y === 1 && vec.Z === 1) {
        return undefined;
    }

    return vectorToArray(vec);
}

const defaultRotator = Rotator.MakeFromEuler(new Vector());
const defaultScale = new Vector(1, 1, 1);

function genTransform(state: IEntityState): Transform {
    let rotator: Rotator = defaultRotator;
    if (state.Rotation) {
        rotator = Rotator.MakeFromEuler(arrayToVector(state.Rotation));
    }

    const pos = arrayToVector(state.Pos);
    const scale = state.Scale ? arrayToVector(state.Scale) : defaultScale;

    const transform = new Transform(rotator, pos, scale);
    return transform;
}

function genState(entity: ITsEntity): Record<string, unknown> {
    // 编辑器模式下, Entity是不存在的,故而没有必要生成其状态
    if (entity.Entity === undefined) {
        return undefined;
    }

    const stateComponent = entity.Entity.TryGetComponent(StateComponent);
    if (!stateComponent) {
        return undefined;
    }

    return stateComponent.GenSnapshot();
}

function applyState(entity: ITsEntity, state: Record<string, unknown>): void {
    if (state === undefined) {
        return;
    }

    const stateComponent = entity.Entity.TryGetComponent(StateComponent);
    if (!stateComponent) {
        error(`apply state to ${entity.Name} but has not state component`);
        return;
    }

    stateComponent.ApplySnapshot(state);
}

class EntitySerializer {
    public GenEntityState(entity: ITsEntity): IEntityState {
        return {
            PrefabId: getBlueprintId(entity.GetClass()),
            Pos: vectorToArray(entity.K2_GetActorLocation()),
            Rotation: genRotationArray(entity.K2_GetActorRotation().Euler()),
            Scale: genScaleArray(entity.GetActorScale3D()),
            PureData: entitySchemeRegistry.GenData(entity),
            State: genState(entity),
        };
    }

    public SpawnEntityByState(context: IGameContext, state: IEntityState): TsEntity {
        const actorClass = getBlueprintType(state.PrefabId);
        const transfrom = genTransform(state);
        const entity = GameplayStatics.BeginDeferredActorSpawnFromClass(
            context.World,
            actorClass,
            transfrom,
        ) as TsEntity;
        GameplayStatics.FinishSpawningActor(entity, transfrom);
        entitySchemeRegistry.ApplyData(state.PureData, entity);
        entity.Init(context);
        applyState(entity, state.State);
        entity.Load();

        return entity;
    }

    public GenPlayerState(player: ITsPlayer): IPlayerState {
        return {
            Pos: vectorToArray(player.K2_GetActorLocation()),
            Rotation: genRotationArray(player.K2_GetActorRotation().Euler()),
        };
    }

    public ApplyPlayerState(player: ITsPlayer, state: IPlayerState): void {
        const pos = arrayToVector(state.Pos);
        player.K2_SetActorLocation(pos, false, undefined, false);
        const rotator = Rotator.MakeFromEuler(arrayToVector(state.Rotation));
        player.K2_SetActorRotation(rotator, false);
    }
}

export const entitySerializer = new EntitySerializer();
