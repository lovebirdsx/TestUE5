// import { makeUClass } from 'puerts';
import { Actor, Class } from 'ue';

import { error, log } from '../../UniverseEditor/Common/Misc/Log';

class TsTestCreateSubobject extends Actor {
    // private ActionRunner: TsActionRunner;

    public Constructor(): void {
        this.Test();
        this.Test2();
    }

    // @no-blueprint
    private Test2(): void {
        const path = '/Game/ThirdPerson/Blueprints/BP_Task.BP_Task_C';
        const classObj = Class.Load(path);
        if (!classObj) {
            error(`Load class by ${path} failed`);
        } else {
            log(`${path} name is ${classObj.GetName()}`);
        }
    }

    // @no-blueprint
    private Test(): void {
        // 方法1：通过Class.Load加载，结果：失败
        // let classObj = Class.Load(
        //     '/Game/Blueprints/TypeScript/Game/Flow/ActionRunner.ActionRunner_C',
        // );
        // if (!classObj) {
        //     error(`Load ActionRunner by Class.Load failed`);
        // } else {
        //     log(`Load ActionRunner class is ${classObj.GetName()}`);
        // }
        // 方法1：通过makeUClass加载，结果：成功
        // classObj = makeUClass(TsActionRunner);
        // this.ActionRunner = this.CreateDefaultSubobject(
        //     'ActionRunner',
        //     classObj,
        //     classObj,
        //     true,
        //     true,
        //     true,
        // ) as TsActionRunner;
        // log(`ActionRunner is ${this.ActionRunner.GetName()}`);
    }
}

export default TsTestCreateSubobject;
