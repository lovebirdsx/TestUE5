/* eslint-disable @typescript-eslint/no-magic-numbers */
import { PrimitiveComponent, Rotator, Vector } from 'ue';

import { InteractiveComponent } from '../Interface';
import { ISettingSpringDir, ISpringComponent } from '../Interface/IComponent';

export class SpringComponent extends InteractiveComponent implements ISpringComponent {
    public IsNormalSpring: boolean;

    public IsHitNormalSpring: boolean;

    public SettingDir: ISettingSpringDir;

    public SpringPow: number;

    private OriginRotator: Rotator;

    public OnStart(): void {
        this.OriginRotator = this.Entity.Actor.K2_GetActorRotation();
    }

    public EventHit(
        myComp: PrimitiveComponent,
        otherComp: PrimitiveComponent,
        hitNormal: Vector,
        normalImpulse: Vector,
    ): void {
        if (otherComp.IsSimulatingPhysics()) {
            let impulseDir: Vector = normalImpulse; // 正常反弹方向
            if (this.SettingDir.IsSettingDir) {
                // 固定方向反弹
                impulseDir = new Vector(
                    this.SettingDir.SpringDir.X,
                    this.SettingDir.SpringDir.Y,
                    this.SettingDir.SpringDir.Z,
                );
                if (this.SettingDir.IsRotator) {
                    const rotator = this.Entity.Actor.K2_GetActorRotation().op_Subtraction(
                        this.OriginRotator,
                    );
                    impulseDir = rotator.RotateVector(impulseDir);
                }
            } else if (this.IsHitNormalSpring) {
                impulseDir = hitNormal; // 撞击方向反弹
            }
            impulseDir = impulseDir.GetSafeNormal(1);
            otherComp.AddImpulse(impulseDir.op_Multiply(this.SpringPow * 100));
        }
    }
}
