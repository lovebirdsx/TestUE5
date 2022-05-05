import { PrimitiveComponent, Vector } from 'ue';

import { InteractiveComponent } from '../Interface';

export class SpringComponent extends InteractiveComponent {
    public OnInit(): void {}

    public EventHit(
        myComp: PrimitiveComponent,
        otherComp: PrimitiveComponent,
        normalImpulse: Vector,
    ): void {
        if (otherComp.IsSimulatingPhysics()) {
            // TODO scheme 设置反弹方向 力度， 打印看数值为上万，单位应该是百分位
            const impulse = normalImpulse.op_Multiply(10);
            otherComp.AddImpulse(impulse);
        }
    }
}
