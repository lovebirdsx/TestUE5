/* eslint-disable import/no-restricted-paths */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { KismetMathLibrary, Vector } from 'ue';

import { getTotalSecond } from '../../Common/Misc/Util';
import { deInitTsEntity } from '../Entity/Common';
import { Component, gameContext, ITimeCall } from '../Interface';
import { toTransform, toTransformInfo } from '../Interface/Action';
import { ISpawn } from '../Interface/IAction';
import { ICylinder, IRefreshGroup, IRefreshSingleComponent } from '../Interface/IComponent';
import { IEntityData } from '../Interface/IEntity';
import { EntitySpawnerComponent } from './EntitySpawnerComponent';
import { StateComponent } from './StateComponent';

export class RefreshSingleComponent
    extends Component
    implements IRefreshSingleComponent, ITimeCall
{
    public CallTime = -1;

    public RefreshInterval: number;

    public MaxRefreshTimes: number;

    public DelayRefresh: boolean;

    public TemplateGuid: number;

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

    private readonly OnEntityRemoved = (id: number): void => {
        if (!this.Spawn.HasChild(id)) {
            return;
        }
        const second = getTotalSecond();
        const destroyType = gameContext.EntityManager.GetDestoryType(id);
        if (destroyType === 'delete') {
            this.CallTime = second + this.RefreshInterval;
            if (!this.DelayRefresh) {
                this.AddCall();
            } else {
                this.State.SetState('RefreshTime', this.CallTime);
            }
        }
    };

    public OnStart(): void {
        if (this.RefreshTimes >= this.MaxRefreshTimes && this.Spawn.GetChildNum() === 0) {
            // 如果刷满且没有子实体了就删除实体;
            const id = this.Entity.Id;
            const tsEntity = gameContext.EntityManager.GetEntity(id);
            if (tsEntity) {
                deInitTsEntity(tsEntity);
                tsEntity.K2_DestroyActor();
            }
            return;
        }
        const second = getTotalSecond();
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
                TemplateGuid: this.TemplateGuid,
                Transform: transformInfo,
            };
            this.Spawn.Spawn(spawn);
        }
    }
}

// -----------------------------------------------------------------------------------------------------

export class RefreshEntityComponent extends Component implements IRefreshGroup, ITimeCall {
    public CallTime = -1;

    public RefreshInterval: number;

    public MaxRefreshTimes: number;

    public DelayRefresh: boolean;

    public EntityIdList: number[];

    public IsUesCylinder: ICylinder;

    private State: StateComponent;

    private RefreshTimes = 0;

    private readonly OriginEntityMap = new Map<number, IEntityData>();

    public OnInit(): void {
        this.State = this.Entity.GetComponent(StateComponent);
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

    private readonly OnEntityRemoved = (id: number): void => {
        if (this.EntityIdList.includes(id)) {
            const second = getTotalSecond();
            const destroyType = gameContext.EntityManager.GetDestoryType(id);
            if (destroyType === 'delete' && this.CallTime === -1) {
                this.CallTime = second + this.RefreshInterval;
                if (!this.DelayRefresh) {
                    this.AddCall();
                } else {
                    this.State.SetState('RefreshTime', this.CallTime);
                }
            } else {
                if (destroyType === 'deleteByRefresh') {
                    this.RefreshEntity(id);
                }
            }
        }
    };

    private RecordOringinTransform(): void {
        let entitylist: IEntityData[] = [];
        if (this.State.GetState('SpawnRecord')) {
            entitylist = this.State.GetState('SpawnRecord');
        }
        if (entitylist.length !== this.EntityIdList.length) {
            this.EntityIdList.forEach((guid) => {
                const tsEntity = gameContext.EntityManager.GetEntity(guid);
                if (tsEntity) {
                    //const data = entityRegistry.GenData(tsEntity);
                    //entitylist.push(data);
                }
            });
            this.State.SetState('SpawnRecord', entitylist);
        }
        entitylist.forEach((data) => {
            this.OriginEntityMap.set(data.Id, data);
        });
    }

    public OnStart(): void {
        // 记录初始信息，并删除最初实体
        this.RecordOringinTransform();
        const second = getTotalSecond();
        if (this.CallTime > 0) {
            if (second < this.CallTime) {
                this.AddCall();
            } else {
                this.Refresh();
            }
        }
    }

    public TimeCall = (): void => {
        this.Refresh();
    };

    public AddCall(): void {
        if (this.MaxRefreshTimes > 0 && this.RefreshTimes >= this.MaxRefreshTimes) {
            return;
        }
        if (!gameContext.TickManager.HasTimeCall(this) && this.CallTime > 0) {
            gameContext.TickManager.AddTimeCall(this);
            this.State.SetState('RefreshTime', this.CallTime);
        }
    }

    public Refresh(): void {
        // 次数刷满没  todo 有的次数无限制 优化一下
        if (this.MaxRefreshTimes > 0 && this.RefreshTimes >= this.MaxRefreshTimes) {
            return;
        }
        this.RefreshGroup();
        this.CallTime = -1;
        this.RefreshTimes += 1;
        this.State.SetState('RefreshTime', this.CallTime);
        this.State.SetState('TriggerTimes', this.RefreshTimes);
    }

    public RefreshGroup(): void {
        const delelist = [];
        if (!this.DelayRefresh) {
            this.EntityIdList.forEach((guid) => {
                const tsEntity = gameContext.EntityManager.GetEntity(guid);
                if (tsEntity) {
                    gameContext.EntityManager.RemoveEntity(tsEntity, 'deleteByRefresh');
                    delelist.push(guid);
                }
            });
        }

        this.OriginEntityMap.forEach((data, guid) => {
            if (!delelist.includes(guid)) {
                this.RefreshEntity(guid);
            }
        });
    }

    public RefreshEntity(id: number): void {
        const data = this.OriginEntityMap.get(id);
        if (data) {
            const transform = toTransform(data.Transform);
            if (this.IsUesCylinder.IsUse) {
                // 随机取点
                const theta = 2 * 3.14 * KismetMathLibrary.RandomInteger(360);
                const radius = KismetMathLibrary.RandomInteger(this.IsUesCylinder.Radius);
                const height = KismetMathLibrary.RandomInteger(this.IsUesCylinder.Height);
                const pos = this.IsUesCylinder.CylinderPos;
                const vector = new Vector(
                    pos.X + radius * KismetMathLibrary.Cos(theta),
                    pos.Y + radius * KismetMathLibrary.Sin(theta),
                    pos.Z + height,
                );
                transform.SetLocation(vector);
            }
            gameContext.StateManager.DeleteState(data.Id);
            gameContext.EntityManager.SpawnEntity(data, transform, 'streaming');
        }
    }
}
