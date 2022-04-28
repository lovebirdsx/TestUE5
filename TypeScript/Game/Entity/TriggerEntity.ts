import { ActionRunnerComponent, ActionRunnerHandler } from '../Component/ActionRunnerComponent';
import { IActionInfo } from '../Flow/Action';
import { Entity } from '../Interface';

export class TriggerEntity extends Entity {
    public MaxTriggerTimes: number;

    public ActionInfos: IActionInfo[];

    private ActionRunner: ActionRunnerComponent;

    private RunnerHandler: ActionRunnerHandler;

    public Init(): void {
        this.ActionRunner = this.GetComponent(ActionRunnerComponent);
        this.RunnerHandler = this.ActionRunner.SpawnHandler(this.ActionInfos);
    }

    public async Interact(): Promise<void> {
        // await this.Flow.Run();
    }
}
