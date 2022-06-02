/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { toTransform, toTransformInfo } from '../../Common/Interface';
import { getTotalSecond } from '../../Common/Util';
import { deInitTsEntity } from '../Entity/Common';
import { entityRegistry } from '../Entity/EntityRegistry';
import { ISpawn } from '../Flow/Action';
import { Component, gameContext, IEntityData, ITimeCall } from '../Interface';
import { EntitySpawnerComponent } from './EntitySpawnerComponent';
import { StateComponent } from './StateComponent';

export interface IRefreshSingle {
    RefreshInterval: number;
    MaxRefreshTimes: number;
    DelayRefresh: boolean;
    TemplateGuid: ITempleGuid;
}

export interface ITempleGuid {
    TempleGuid: string;
}

export class RefreshSingleComponent extends Component implements IRefreshSingle, ITimeCall {
    public CallTime = -1;

    public RefreshInterval: number;

    public MaxRefreshTimes: number;

    public DelayRefresh: boolean;

    public TemplateGuid: ITempleGuid;

    private State: StateComponent;

    private Spawn: EntitySpawnerComponent;

    private RefreshTimes = 0;

    private readonly MaxNum = 1;

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);
        this.Spawn = this.Entity.GetComponent(EntitySpawnerComponent);
        gameContext.EntityManager.EntityRemoved.AddCallback(this.OnEntityRemoved);
    }

    public OnLoadState(): void {
        if (this.State.HasState('RefreshTime')) {
            this.CallTime = this.State.GetState('RefreshTime');
        }
        if (this.State.HasState('TriggerTimes')) {
            this.RefreshTimes = this.State.GetState('TriggerTimes');
        }
    }

    public OnDestroy(): void {
        this.State.SetState('TriggerTimes', this.RefreshTimes);
        this.State.SetState('RefreshTime', this.CallTime);
        gameContext.EntityManager.EntityRemoved.RemoveCallBack(this.OnEntityRemoved);
        if (gameContext.TickManager.HasTimeCall(this)) {
            gameContext.TickManager.RemoveTimeCall(this);
        }
    }

    private readonly OnEntityRemoved = (guid: string): void => {
        if (!this.Spawn.HasChild(guid)) {
            return;
        }
        const second = getTotalSecond();
        this.CallTime = second + this.RefreshInterval;
        if (!this.DelayRefresh) {
            this.AddCall();
        } else {
            this.State.SetState('RefreshTime', this.CallTime);
        }
    };

    public OnStart(): void {
        const second = getTotalSecond();
        if (this.RefreshTimes >= this.MaxRefreshTimes && this.Spawn.GetChildNum() === 0) {
            // 如果刷满且没有子实体了就删除实体;
            const guid = this.Entity.Guid;
            const tsEntity = gameContext.EntityManager.GetEntity(guid);
            if (tsEntity) {
                deInitTsEntity(tsEntity);
                tsEntity.K2_DestroyActor();
            }
            return;
        }
        if (second < this.CallTime) {
            this.AddCall();
        } else {
            this.Refresh();
        }
    }

    public TimeCall = (): void => {
        this.Refresh();
    };

    public AddCall(): void {
        if (this.RefreshTimes >= this.MaxRefreshTimes) {
            return;
        }
        if (!gameContext.TickManager.HasTimeCall(this) && this.CallTime > 0) {
            gameContext.TickManager.AddTimeCall(this);
            this.State.SetState('RefreshTime', this.CallTime);
        }
    }

    public Refresh(): void {
        // 数量满没
        if (this.Spawn.GetChildNum() >= this.MaxNum) {
            return;
        }
        // 次数刷满没
        if (this.RefreshTimes >= this.MaxRefreshTimes) {
            return;
        }
        this.CreateSingle();
        this.CallTime = -1;
        this.RefreshTimes += 1;
        this.State.SetState('RefreshTime', this.CallTime);
        this.State.SetState('TriggerTimes', this.RefreshTimes);
    }

    public CreateSingle(): void {
        const transformInfo = toTransformInfo(this.Entity.Actor.GetTransform());
        if (this.TemplateGuid) {
            const spawn: ISpawn = {
                TemplateGuid: this.TemplateGuid.TempleGuid,
                Transform: transformInfo,
            };
            this.Spawn.Spawn(spawn);
        }
    }
}

// -----------------------------------------------------------------------------------------------------

export interface IRefreshGroup {
    RefreshInterval: number;
    MaxRefreshTimes: number;
    DelayRefresh: boolean;
    EntityGuidList: string[];
}

export class RefreshEntityComponent extends Component implements IRefreshGroup, ITimeCall {
    public CallTime = -1;

    public RefreshInterval: number;

    public MaxRefreshTimes: number;

    public DelayRefresh: boolean;

    public EntityGuidList: string[];

    private State: StateComponent;

    private Spawn: EntitySpawnerComponent;

    private RefreshTimes = 0;

    private readonly OriginEntityData: Map<string, IEntityData>;

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);
        this.Spawn = this.Entity.GetComponent(EntitySpawnerComponent);
        gameContext.EntityManager.EntityRemoved.AddCallback(this.OnEntityRemoved);
    }

    public OnLoadState(): void {
        if (this.State.HasState('RefreshTime')) {
            this.CallTime = this.State.GetState('RefreshTime');
        }
        if (this.State.HasState('TriggerTimes')) {
            this.RefreshTimes = this.State.GetState('TriggerTimes');
        }
    }

    public OnDestroy(): void {
        this.State.SetState('TriggerTimes', this.RefreshTimes);
        this.State.SetState('RefreshTime', this.CallTime);
        gameContext.EntityManager.EntityRemoved.RemoveCallBack(this.OnEntityRemoved);
        if (gameContext.TickManager.HasTimeCall(this)) {
            gameContext.TickManager.RemoveTimeCall(this);
        }
    }

    private readonly OnEntityRemoved = (guid: string): void => {
        if (!this.Spawn.HasChild(guid)) {
            return;
        }
        const second = getTotalSecond();
        this.CallTime = second + this.RefreshInterval;
        if (!this.DelayRefresh) {
            this.AddCall();
        } else {
            this.State.SetState('RefreshTime', this.CallTime);
        }
    };

    private RecordOringinTransform(): void {
        this.EntityGuidList.forEach((guid) => {
            const tsEntity = gameContext.EntityManager.GetEntity(guid);
            if (tsEntity) {
                const data = entityRegistry.GenData(tsEntity);
                this.OriginEntityData.set(guid, data);
            }
        });
    }

    public OnStart(): void {
        this.RecordOringinTransform();
        const second = getTotalSecond();
        if (this.RefreshTimes >= this.MaxRefreshTimes && this.Spawn.GetChildNum() === 0) {
            const guid = this.Entity.Guid;
            const tsEntity = gameContext.EntityManager.GetEntity(guid);
            if (tsEntity) {
                deInitTsEntity(tsEntity);
                tsEntity.K2_DestroyActor();
            }
            return;
        }
        if (second < this.CallTime) {
            this.AddCall();
        } else {
            this.Refresh();
        }
    }

    public TimeCall = (): void => {
        this.Refresh();
    };

    public AddCall(): void {
        if (this.RefreshTimes >= this.MaxRefreshTimes) {
            return;
        }
        if (!gameContext.TickManager.HasTimeCall(this) && this.CallTime > 0) {
            gameContext.TickManager.AddTimeCall(this);
            this.State.SetState('RefreshTime', this.CallTime);
        }
    }

    public Refresh(): void {
        // 数量满没
        if (this.Spawn.GetChildNum() >= this.EntityGuidList.length) {
            return;
        }
        // 次数刷满没
        if (this.RefreshTimes >= this.MaxRefreshTimes) {
            return;
        }
        this.RefreshGroup();
        this.CallTime = -1;
        this.RefreshTimes += 1;
        this.State.SetState('RefreshTime', this.CallTime);
        this.State.SetState('TriggerTimes', this.RefreshTimes);
    }

    public RefreshGroup(): void {
        // 先delete 整组
        this.EntityGuidList.forEach((guid) => {
            const tsEntity = gameContext.EntityManager.GetEntity(guid);
            if (tsEntity) {
                gameContext.EntityManager.RemoveEntity(tsEntity, 'delete');
            }
        });
        // 整组刷
        this.EntityGuidList.forEach((guid) => {
            const entityData = this.OriginEntityData.get(guid);
            if (entityData) {
                const transform = toTransform(entityData.Transform);
                gameContext.EntityManager.SpawnEntity(entityData, transform);
            }
        });
    }
}
