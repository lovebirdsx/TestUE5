/* eslint-disable spellcheck/spell-checker */
import { ITransform, toTransform } from '../../Common/Interface';
import { EntityTemplateOp } from '../Common/Operations/EntityTemplate';
import { IActionInfo, ISpawn } from '../Flow/Action';
import { Component, gameContext, ITsEntity } from '../Interface';
import { ActionRunnerComponent } from './ActionRunnerComponent';
import StateComponent from './StateComponent';

interface IEntitySpawnRecord {
    TemplateGuid: string;
    EntityGuid: string;
    Transform: ITransform;
}

const SPAWN_RECORD = 'SpawnRecord';

export class EntitySpawnerComponent extends Component {
    private State: StateComponent;

    private SpawnRecord: IEntitySpawnRecord[] = [];

    private readonly Children: Set<ITsEntity> = new Set();

    public OnInit(): void {
        const actionRunner = this.Entity.GetComponent(ActionRunnerComponent);
        actionRunner.RegisterActionFun('SpawnChild', this.ExcuteSpawnChild.bind(this));
        actionRunner.RegisterActionFun('DestroyAllChild', this.ExcuteDestroyAllChild.bind(this));

        this.State = this.Entity.GetComponent(StateComponent);

        gameContext.EntityManager.EntityRemoved.AddCallback(this.OnEntityRemoed);
    }

    public OnDestroy(): void {
        gameContext.EntityManager.EntityRemoved.RemoveCallBack(this.OnEntityRemoed);
    }

    private readonly OnEntityRemoed = (entity: ITsEntity): void => {
        if (!this.Children.has(entity)) {
            return;
        }

        this.Children.delete(entity);
        this.SpawnRecord.splice(
            this.SpawnRecord.findIndex((record) => record.EntityGuid === entity.Guid),
            1,
        );

        if (this.SpawnRecord.length <= 0) {
            this.State.SetState(SPAWN_RECORD, undefined);
        }
    };

    public OnLoadState(): void {
        this.SpawnRecord = this.State.GetState(SPAWN_RECORD) || [];

        this.SpawnRecord.forEach((record) => {
            const entityData = EntityTemplateOp.GenEntityData(
                record.TemplateGuid,
                record.EntityGuid,
            );

            const entity = gameContext.EntityManager.SpawnEntity(
                entityData,
                toTransform(record.Transform),
            );
            this.Children.add(entity);
        });
    }

    private ExcuteSpawnChild(actionInfo: IActionInfo): void {
        const action = actionInfo.Params as ISpawn;
        const entityData = EntityTemplateOp.GenEntityData(action.TemplateGuid);
        const entity = gameContext.EntityManager.SpawnEntity(
            entityData,
            toTransform(action.Transform),
        );

        this.Children.add(entity);
        this.SpawnRecord.push({
            TemplateGuid: action.TemplateGuid,
            Transform: action.Transform,
            EntityGuid: entity.Guid,
        });
        this.State.SetState(SPAWN_RECORD, this.SpawnRecord);
    }

    private ExcuteDestroyAllChild(actionInfo: IActionInfo): void {
        gameContext.EntityManager.RemoveEntity(...this.Children);

        this.Children.clear();
        this.SpawnRecord.splice(0);
        this.State.SetState(SPAWN_RECORD, undefined);
    }
}
