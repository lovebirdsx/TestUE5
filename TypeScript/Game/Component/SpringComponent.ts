import { PrimitiveComponent, Vector } from 'ue';

import { IVectorType } from '../../Common/Type';
import { InteractiveComponent } from '../Interface';
import { ISpringComponent } from '../Scheme/Component/SpringComponentScheme';

export class SpringComponent extends InteractiveComponent implements ISpringComponent {
    public SpringDir: IVectorType;

    public SpringPow: number;

    public EventHit(
        myComp: PrimitiveComponent,
        otherComp: PrimitiveComponent,
        normalImpulse: Vector,
    ): void {
        if (otherComp.IsSimulatingPhysics()) {
            // 物体要开启模拟物理 和 碰撞命中
            const impulseDir = new Vector(this.SpringDir.X, this.SpringDir.Y, this.SpringDir.Z);
            otherComp.AddImpulse(impulseDir.op_Multiply(this.SpringPow));
        }
    }
}
