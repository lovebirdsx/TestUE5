/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';
import { Actor, EditorLevelLibrary, EditorOperations, Vector } from 'ue';

import {
    alignVector,
    defalutRot,
    defalutScale,
    defaultVec,
    toScaleInfo,
    toTransformInfo,
    toVector,
    toVectorInfo,
} from '../../../../Common/Interface/Action';
import { ISpawn, IVectorInfo } from '../../../../Common/Interface/IAction';
import { ITsEntityBase } from '../../../../Common/Interface/IEntity';
import { MS_PER_SEC } from '../../../../Common/Misc/Async';
import { deepEquals } from '../../../../Common/Misc/Util';
import { tempEntities } from '../../../EntityEditor/TempEntities';
import {
    Btn,
    COLOR_LEVEL1,
    DEFUALT_NUMBER_EDIT_TEXT_WIDTH,
    EditorBox,
    Fold,
    TAB_OFFSET,
    Text,
} from '../../BaseComponent/CommonComponent';
import { EntityTemplateSelector } from '../../BaseComponent/EntityTemplateSelector';
import LevelEditorUtil from '../../LevelEditorUtil';
import { IProps } from '../../Type';

interface IPointState {
    TipEntity: ITsEntityBase;
    IsFolded: boolean;
}

function parsePosValue(text: string): number {
    return parseInt(text, 10);
}

function parseRotValue(text: string): number {
    return parseInt(text, 10);
}

function parseScaleValue(text: string): number {
    return parseFloat(text);
}

export class Spawn extends React.Component<IProps<ISpawn>, IPointState> {
    public constructor(props: IProps<ISpawn>) {
        super(props);
        this.state = {
            TipEntity: undefined,
            IsFolded: false,
        };
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public componentWillUnmount(): void {
        if (this.state.TipEntity) {
            EditorOperations.GetEditorEvent().OnActorMoved.Remove(this.OnTipEntityMoved);

            tempEntities.Remove(this.state.TipEntity);
            EditorLevelLibrary.DestroyActor(this.state.TipEntity);
        }
    }

    private readonly ModifyPosX = (value: number): void => {
        const newPos = Object.assign({}, this.props.Value.Transform.Pos);
        newPos.X = value;
        this.SetPosition(toVector(newPos));
    };

    private readonly ModifyPosY = (value: number): void => {
        const newPos = Object.assign({}, this.props.Value.Transform.Pos);
        newPos.Y = value;
        this.SetPosition(toVector(newPos));
    };

    private readonly ModifyPosZ = (value: number): void => {
        const newPos = Object.assign({}, this.props.Value.Transform.Pos);
        newPos.Z = value;
        this.SetPosition(toVector(newPos));
    };

    private readonly ModifyRotX = (value: number): void => {
        const newRot = Object.assign({}, this.props.Value.Transform.Rot);
        newRot.X = value;
        this.SetRotation(toVector(newRot));
    };

    private readonly ModifyRotY = (value: number): void => {
        const newRot = Object.assign({}, this.props.Value.Transform.Rot);
        newRot.Y = value;
        this.SetRotation(toVector(newRot));
    };

    private readonly ModifyRotZ = (value: number): void => {
        const newRot = Object.assign({}, this.props.Value.Transform.Rot);
        newRot.Z = value;
        this.SetRotation(toVector(newRot));
    };

    private readonly ModifyScaleX = (value: number): void => {
        const newScale = Object.assign({}, this.props.Value.Transform.Scale);
        newScale.X = value;
        this.SetScale(toVector(newScale));
    };

    private readonly ModifyScaleY = (value: number): void => {
        const newScale = Object.assign({}, this.props.Value.Transform.Scale);
        newScale.Y = value;
        this.SetScale(toVector(newScale));
    };

    private readonly ModifyScaleZ = (value: number): void => {
        const newScale = Object.assign({}, this.props.Value.Transform.Scale);
        newScale.Z = value;
        this.SetScale(toVector(newScale));
    };

    private readonly OnTipEntityMoved = (actor: Actor): void => {
        if (this.state.TipEntity !== actor) {
            return;
        }

        setTimeout(() => {
            this.UpdataTransform();
        }, MS_PER_SEC * 0.1);
    };

    private GenTipEntity(): void {
        const spawn = this.props.Value;
        const entity = LevelEditorUtil.SpawnEntity(spawn.TemplateGuid, spawn.Transform);
        if (entity) {
            tempEntities.Add(entity);
            this.setState({
                TipEntity: entity,
            });
            EditorOperations.GetEditorEvent().OnActorMoved.Add(this.OnTipEntityMoved);

            LevelEditorUtil.SelectActor(entity);
            LevelEditorUtil.FocusSelected();
        }
    }

    private readonly GenTipActor = (): void => {
        this.GenTipEntity();
    };

    private readonly RemoveTipActor = (): void => {
        const entity = this.state.TipEntity;
        if (entity) {
            if (LevelEditorUtil.IsSelect(entity)) {
                LevelEditorUtil.ClearSelect();
            }

            EditorOperations.GetEditorEvent().OnActorMoved.Remove(this.OnTipEntityMoved);

            this.setState({
                TipEntity: undefined,
            });

            entity.K2_DestroyActor();
        }
    };

    private readonly SetToCurrentCamera = (): void => {
        const pos = LevelEditorUtil.GetCameraHitPos();
        if (!this.state.TipEntity) {
            this.GenTipEntity();
        }

        this.SetPosition(pos);
    };

    private SetPosition(vec: Vector): void {
        alignVector(vec);
        const newValue = produce(this.props.Value, (draft) => {
            draft.Transform.Pos = toVectorInfo(vec);
        });
        this.props.OnModify(newValue, 'normal');
    }

    private SetRotation(rot: Vector): void {
        alignVector(rot);
        const newValue = produce(this.props.Value, (draft) => {
            draft.Transform.Rot = toVectorInfo(rot, defalutRot);
        });
        this.props.OnModify(newValue, 'normal');
    }

    private SetScale(scale: Vector): void {
        alignVector(scale, 0.05);
        const newValue = produce(this.props.Value, (draft) => {
            draft.Transform.Scale = toScaleInfo(scale);
        });
        this.props.OnModify(newValue, 'normal');
    }

    private readonly UpdataTransform = (): void => {
        const transform = toTransformInfo(this.state.TipEntity.GetTransform());
        alignVector(transform.Pos);
        alignVector(transform.Rot);
        alignVector(transform.Scale, 0.05);

        if (deepEquals(transform, this.props.Value.Transform)) {
            return;
        }

        const newValue = produce(this.props.Value, (draft) => {
            draft.Transform = transform;
        });
        this.props.OnModify(newValue, 'normal');
    };

    private readonly OnClickBtnNav = (): void => {
        LevelEditorUtil.SelectActor(this.state.TipEntity);
        LevelEditorUtil.FocusSelected();
    };

    private RenderForNoTip(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn
                    Text={'生成指示'}
                    OnClick={this.GenTipActor}
                    Tip={'在地图中生成目标指示的实体,调整完毕后记得要删除'}
                />
                <Btn
                    Text={'当前镜头'}
                    OnClick={this.SetToCurrentCamera}
                    Tip={'将提示实体的位置生成到当前镜头位置'}
                />
            </HorizontalBox>
        );
    }

    private RenderForTip(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn
                    Text={'移除指示'}
                    Color={COLOR_LEVEL1}
                    OnClick={this.RemoveTipActor}
                    Tip={'移除用提提示的实体对象'}
                />
                <Btn
                    Text={'更新变换'}
                    OnClick={this.UpdataTransform}
                    Tip={'以提示实体的变换来更新'}
                />
                <Btn Text={'◉'} OnClick={this.OnClickBtnNav} Tip={'在场景中选中提示实体'} />
            </HorizontalBox>
        );
    }

    private RenderNumber(
        value: number,
        formatFun: (text: string) => number,
        modifyCallBack: (v: number) => void,
    ): JSX.Element {
        return (
            <EditorBox
                Text={value.toString()}
                Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                OnChange={(text): void => {
                    const newValue = formatFun(text);
                    if (newValue !== value) {
                        modifyCallBack(newValue);
                    }
                }}
            />
        );
    }

    private readonly ResetPos = (): void => {
        this.SetPosition(toVector(defaultVec));
    };

    private readonly ResetRotation = (): void => {
        this.SetRotation(toVector(defalutRot));
    };

    private readonly ResetScale = (): void => {
        this.SetScale(toVector(defalutScale));
    };

    private RenderPosition(pos: IVectorInfo): JSX.Element {
        return (
            <HorizontalBox>
                <Text Text={'位置:'} />
                {this.RenderNumber(pos.X || 0, parsePosValue, this.ModifyPosX)}
                {this.RenderNumber(pos.Y || 0, parsePosValue, this.ModifyPosY)}
                {this.RenderNumber(pos.Z || 0, parsePosValue, this.ModifyPosZ)}
                <Btn Text={'重置'} OnClick={this.ResetPos} />
            </HorizontalBox>
        );
    }

    private RenderRotation(rot: IVectorInfo): JSX.Element {
        return (
            <HorizontalBox>
                <Text Text={'旋转:'} />
                {this.RenderNumber(rot.X || 0, parseRotValue, this.ModifyRotX)}
                {this.RenderNumber(rot.Y || 0, parseRotValue, this.ModifyRotY)}
                {this.RenderNumber(rot.Z || 0, parseRotValue, this.ModifyRotZ)}
                <Btn Text={'重置'} OnClick={this.ResetRotation} />
            </HorizontalBox>
        );
    }

    private RenderScale(scale: IVectorInfo): JSX.Element {
        return (
            <HorizontalBox>
                <Text Text={'放缩:'} />
                {this.RenderNumber(scale.X || 1, parseScaleValue, this.ModifyScaleX)}
                {this.RenderNumber(scale.Y || 1, parseScaleValue, this.ModifyScaleY)}
                {this.RenderNumber(scale.Z || 1, parseScaleValue, this.ModifyScaleZ)}
                <Btn Text={'重置'} OnClick={this.ResetScale} />
            </HorizontalBox>
        );
    }

    private readonly OnFoldChange = (): void => {
        this.setState({
            IsFolded: !this.state.IsFolded,
        });
    };

    private readonly OnModifyTemplateGuid = (newId: number): void => {
        const newValue = produce(this.props.Value, (draft) => {
            draft.TemplateGuid = newId;
        });
        this.props.OnModify(newValue, 'normal');
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const tipEntity = this.state.TipEntity;
        const transform = this.props.Value.Transform;
        if (tipEntity) {
            LevelEditorUtil.SetITransform(tipEntity, transform);
        }
        return (
            <VerticalBox>
                <HorizontalBox>
                    <Fold
                        IsFold={this.state.IsFolded}
                        IsFull={true}
                        OnChanged={this.OnFoldChange}
                    />
                    {this.props.PrefixElement}
                    <EntityTemplateSelector
                        Id={this.props.Value.TemplateGuid}
                        OnModify={this.OnModifyTemplateGuid}
                    />
                </HorizontalBox>
                {!this.state.IsFolded && (
                    <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                        {this.state.TipEntity ? this.RenderForTip() : this.RenderForNoTip()}
                        {this.RenderPosition(transform.Pos || defaultVec)}
                        {this.RenderRotation(transform.Rot || defalutRot)}
                        {this.RenderScale(transform.Scale || defalutScale)}
                    </VerticalBox>
                )}
            </VerticalBox>
        );
    }
}
