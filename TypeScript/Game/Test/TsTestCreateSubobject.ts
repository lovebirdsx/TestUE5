import { makeUClass } from 'puerts';
import { Actor, Class } from 'ue';

import { error, log } from '../../Editor/Common/Log';
import TsActionRunner from '../Flow/TsActionRunner';

class TsTestCreateSubobject extends Actor {
    private ActionRunner: TsActionRunner;

    public Constructor(): void {
        this.Test();
    }

    // @no-blueprint
    private Test(): void {
        // 方法1：通过Class.Load加载，结果：失败
        let classObj = Class.Load(
            '/Game/Blueprints/TypeScript/Game/Flow/ActionRunner.ActionRunner',
        );
        if (!classObj) {
            error(`Load ActionRunner by Class.Load failed`);
        }

        // 方法1：通过makeUClass加载，结果：成功
        classObj = makeUClass(TsActionRunner);

        this.ActionRunner = this.CreateDefaultSubobject(
            'ActionRunner',
            classObj,
            classObj,
            true,
            true,
            true,
        ) as TsActionRunner;
        log(`ActionRunner is ${this.ActionRunner.GetName()}`);
    }
}

export default TsTestCreateSubobject;
