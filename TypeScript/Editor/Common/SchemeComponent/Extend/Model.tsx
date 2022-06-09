/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { AnimBlueprint, Class, SkeletalMesh } from 'ue';

import { IProps } from '../../../../Common/Type';
import TsCharacterEntity from '../../../../Game/Entity/TsCharacterEntity';
import { AssetSelector } from '../../BaseComponent/AssetSelector';
import { entityListCache } from '../../EntityListCache';
import { entityIdContext } from '../Context';

export class MeshSelector extends React.Component<IProps<string>> {
    private readonly OnSelectChanged = (meshPath: string, entityId: number): void => {
        this.props.OnModify(meshPath, 'normal');
        if (meshPath) {
            const entity = entityListCache.GetEntityById(entityId) as TsCharacterEntity;
            if (entity) {
                const mesh = SkeletalMesh.Load(meshPath);
                if (mesh) {
                    entity.Mesh.SetSkeletalMesh(mesh);
                }
            }
        }
    };

    private RenderSelect(entityId: number): JSX.Element {
        return (
            <HorizontalBox>
                <AssetSelector
                    Path={''}
                    ClassType={SkeletalMesh.StaticClass().GetName()}
                    SelectedObjectPath={this.props.Value}
                    OnObjectPathChanged={(path: string): void => {
                        this.OnSelectChanged(path, entityId);
                    }}
                />
            </HorizontalBox>
        );
    }

    public render(): JSX.Element {
        return (
            <entityIdContext.Consumer>
                {(entityId: number): JSX.Element => this.RenderSelect(entityId)}
            </entityIdContext.Consumer>
        );
    }
}

export class AnimSelector extends React.Component<IProps<string>> {
    private readonly OnSelectChanged = (path: string, entityId: number): void => {
        this.props.OnModify(path, 'normal');
        const animPath = path + '_C';
        if (animPath) {
            const entity = entityListCache.GetEntityById(entityId) as TsCharacterEntity;
            if (entity) {
                const classObj = Class.Load(animPath);
                if (classObj) {
                    entity.Mesh.SetAnimClass(classObj);
                }
            }
        }
    };

    private RenderSelect(entityId: number): JSX.Element {
        return (
            <HorizontalBox>
                <AssetSelector
                    Path={''}
                    ClassType={AnimBlueprint.StaticClass().GetName()}
                    SelectedObjectPath={this.props.Value}
                    OnObjectPathChanged={(path: string): void => {
                        this.OnSelectChanged(path, entityId);
                    }}
                />
            </HorizontalBox>
        );
    }

    public render(): JSX.Element {
        return (
            <entityIdContext.Consumer>
                {(entityId: number): JSX.Element => this.RenderSelect(entityId)}
            </entityIdContext.Consumer>
        );
    }
}
