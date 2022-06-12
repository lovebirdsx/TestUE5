import * as UE from 'ue';
import { Character, SkeletalMesh } from 'ue';

import { Component } from '../Interface';
import { IModelComponent } from '../Interface/IComponent';

export class ModelComponent extends Component implements IModelComponent {
    public AnimClass: string;

    public MeshClass: string;

    public OnStart(): void {
        const actor = this.Entity.Actor as Character;

        if (actor.bHidden) {
            return;
        }
        if (this.MeshClass) {
            const mesh = SkeletalMesh.Load(this.MeshClass);
            if (mesh) {
                actor.Mesh.SetSkeletalMesh(mesh);
            }
        }

        if (this.AnimClass) {
            const classObj = UE.Class.Load(this.AnimClass + '_C');
            if (classObj) {
                actor.Mesh.SetAnimClass(classObj);
            }
        }
    }
}
