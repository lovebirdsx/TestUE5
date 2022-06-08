/* eslint-disable spellcheck/spell-checker */
import * as UE from 'ue';
import { Character, SkeletalMesh } from 'ue';

import { Component } from '../Interface';
import { IModelComponent } from '../Interface/Component';

export class ModelComponent extends Component implements IModelComponent {
    public MeshClass: string;

    public AbpClass: string;

    public OnStart(): void {
        // todo check 和设置不同才替换
        const actor = this.Entity.Actor as Character;
        if (this.MeshClass) {
            const mesh = SkeletalMesh.Load(this.MeshClass);
            if (mesh) {
                actor.Mesh.SetSkeletalMesh(mesh);
            }
        }

        if (this.AbpClass) {
            const classObj = UE.Class.Load(this.AbpClass);
            if (classObj) {
                actor.Mesh.SetAnimClass(classObj);
            }
        }
    }
}
