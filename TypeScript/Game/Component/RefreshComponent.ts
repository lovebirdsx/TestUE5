/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { toTransformInfo } from '../../Common/Interface';
import { getTotalSecond } from '../../Common/Util';
import { deInitTsEntity } from '../Entity/Common';
import { ISpawn } from '../Flow/Action';
import { Component, gameContext, ITimeCall } from '../Interface';
import { EntitySpawnerComponent } from './EntitySpawnerComponent';
import { StateComponent } from './StateComponent';

export interface IRefreshSingle {
    RefreshInterval: number;
    MaxRefreshTimes: number;
    DelayRefresh: boolean;
    TemplateGuid: string;
}

export class RefreshSingleComponent extends Component implements IRefreshSingle, ITimeCall {
    public CallTime = -1;

    public RefreshInterval: number;

    public MaxRefreshTimes: number;

    public DelayRefresh: boolean;

    public TemplateGuid: string;

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
                TemplateGuid: this.TemplateGuid,
                Transform: transformInfo,
            };
            this.Spawn.Spawn(spawn);
        }
    }
}
