/* eslint-disable spellcheck/spell-checker */

import { Actor, Character, GameplayStatics, Rotator, Transform, Vector } from 'ue';

import {
    getBlueprintId,
    getBlueprintType,
    getUeClassByTsClass,
    isChildOfClass,
} from '../../Common/Class';
import { error } from '../../Common/Log';
import StateComponent from '../Component/StateComponent';
import { entityRegistry } from '../Entity/EntityRegistry';
import { TsEntity } from '../Entity/Public';
import TsCharacterEntity from '../Entity/TsCharacterEntity';
import { gameContext, IEntityData, ITsEntity } from '../Interface';
import TsPlayer from '../Player/TsPlayer';

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

function genTransform(state: IEntityData): Transform {
    let rotator: Rotator = defaultRotator;
    if (state.Rotation) {
        rotator = Rotator.MakeFromEuler(arrayToVector(state.Rotation));
    }

    const pos = arrayToVector(state.Pos);
    const scale = state.Scale ? arrayToVector(state.Scale) : defaultScale;

    const transform = new Transform(rotator, pos, scale);
    return transform;
}

function applyState(entity: ITsEntity, state: Record<string, unknown>): void {
    if (state === undefined) {
        return;
    }

    const stateComponent = entity.Entity.TryGetComponent(StateComponent);
    if (!stateComponent) {
        error(`apply state to ${entity.GetName()} but has not state component`);
        return;
    }

    stateComponent.ApplySnapshot(state);
}

class EntitySerializer {
    public GenEntityState(entity: ITsEntity): IEntityData {
        return {
            PrefabId: getBlueprintId(entity.GetClass()),
            Pos: vectorToArray(entity.K2_GetActorLocation()),
            Rotation: genRotationArray(entity.K2_GetActorRotation().Euler()),
            Scale: genScaleArray(entity.GetActorScale3D()),
            PureData: entityRegistry.GenData(entity),
        };
    }

    public SpawnEntityByState(state: IEntityData): TsEntity {
        const actorClass = getBlueprintType(state.PrefabId);
        const transfrom = genTransform(state);
        const entity = GameplayStatics.BeginDeferredActorSpawnFromClass(
            gameContext.World,
            actorClass,
            transfrom,
        ) as TsEntity;

        if (isChildOfClass(entity, TsCharacterEntity)) {
            const character = entity as Actor as Character;
            character.SpawnDefaultController();
        }

        entityRegistry.ApplyData(state.PureData, entity);
        entity.Init();
        applyState(entity, undefined);
        entity.LoadState();

        GameplayStatics.FinishSpawningActor(entity, transfrom);

        return entity;
    }

    public SpawnDefaultPlayer(): ITsEntity {
        const startPosActor = gameContext.GameMode.ChoosePlayerStart(gameContext.PlayerController);
        const transform = startPosActor.GetTransform();
        const entity = GameplayStatics.BeginDeferredActorSpawnFromClass(
            gameContext.World,
            getUeClassByTsClass(TsPlayer),
            transform,
        ) as ITsEntity;
        entity.Init();
        GameplayStatics.FinishSpawningActor(entity, transform);
        return entity;
    }

    public ApplyPlayerState(player: ITsEntity, state: IEntityData): void {
        entityRegistry.ApplyData(state.PureData, player);
        player.Init();
        applyState(player, undefined);
        player.LoadState();
    }
}

export const entitySerializer = new EntitySerializer();
