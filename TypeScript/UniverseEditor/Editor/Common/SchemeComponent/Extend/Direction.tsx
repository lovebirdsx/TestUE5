/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { EditorLevelLibrary, Rotator, TargetPoint, Vector } from 'ue';

import { toRotation, toRotationInfo } from '../../../../Common/Interface/Action';
import { IVectorInfo } from '../../../../Common/Interface/IAction';
import {
    Btn,
    Check,
    DEFUALT_NUMBER_EDIT_TEXT_WIDTH,
    EditorBox,
} from '../../BaseComponent/CommonComponent';
import LevelEditorUtil from '../../LevelEditorUtil';
import { IProps } from '../../Type';

interface IPointState {
    TipActor: TargetPoint;
}

export class Direction extends React.Component<IProps<IVectorInfo>, IPointState> {
    public constructor(props: IProps<IVectorInfo>) {
        super(props);
        this.state = {
            TipActor: undefined,
        };
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public componentWillUnmount(): void {
        if (this.state.TipActor) {
            EditorLevelLibrary.DestroyActor(this.state.TipActor);
        }
    }

    private readonly OnModifyX = (text: string): void => {
        const newPos = Object.assign({}, this.props.Value);
        newPos.X = parseFloat(text);
        this.SetDirection(new Rotator(newPos.X, newPos.Y, newPos.Z));
    };

    private readonly OnModifyY = (text: string): void => {
        const newPos = Object.assign({}, this.props.Value);
        newPos.Y = parseFloat(text);
        this.SetDirection(new Rotator(newPos.X, newPos.Y, newPos.Z));
    };

    private readonly OnModifyZ = (text: string): void => {
        const newPos = Object.assign({}, this.props.Value);
        newPos.Z = parseFloat(text);
        this.SetDirection(new Rotator(newPos.X, newPos.Y, newPos.Z));
    };

    private GenTipActorAtPos(vec: Vector): void {
        const actor = EditorLevelLibrary.SpawnActorFromClass(
            TargetPoint.StaticClass(),
            vec,
        ) as TargetPoint;
        this.setState({
            TipActor: actor,
        });
        actor.SetActorScale3D(new Vector(3, 3, 3));
        LevelEditorUtil.SelectActor(actor);
        LevelEditorUtil.FocusSelected();
    }

    private readonly GenTipActor = (): void => {
        const actors = EditorLevelLibrary.GetSelectedLevelActors();
        const actor = actors.Get(0);
        let location = new Vector(0, 0, 0);
        if (actor) {
            location = actor.K2_GetActorLocation();
        }
        this.GenTipActorAtPos(location);
    };

    private readonly RemoveTipActor = (): void => {
        const actor = this.state.TipActor;
        if (actor) {
            if (LevelEditorUtil.IsSelect(actor)) {
                LevelEditorUtil.ClearSelect();
            }
            actor.K2_DestroyActor();
            this.setState({
                TipActor: undefined,
            });
        }
    };

    private readonly SetToCurrentCamera = (): void => {
        const pos = LevelEditorUtil.GetCameraHitPos();
        if (!this.state.TipActor) {
            this.GenTipActorAtPos(pos);
        }
    };

    private SetDirection(rotator: Rotator): void {
        this.props.OnModify(toRotationInfo(rotator), 'normal');
    }

    private readonly UpDirection = (): void => {
        const rotator = this.state.TipActor.K2_GetActorRotation();
        this.SetDirection(rotator);
    };

    private readonly OnClickBtnNav = (): void => {
        LevelEditorUtil.SelectActor(this.state.TipActor);
        LevelEditorUtil.FocusSelected();
    };

    private RenderForNoTip(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn
                    Text={'????????????'}
                    OnClick={this.GenTipActor}
                    Tip={'????????????????????????????????????Actor,??????????????????????????????'}
                />
                <Btn
                    Text={'????????????'}
                    OnClick={this.SetToCurrentCamera}
                    Tip={'????????????????????????????????????'}
                />
            </HorizontalBox>
        );
    }

    private readonly RefreshLocation = (checked: boolean): void => {};

    private RenderForTip(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn Text={'????????????'} OnClick={this.RemoveTipActor} />
                <Btn Text={'????????????'} OnClick={this.UpDirection} />
                <Check Tip={'?????????????????????'} OnChecked={this.RefreshLocation} />
                <Btn Text={'???'} OnClick={this.OnClickBtnNav} Tip={'???????????????????????????'} />
            </HorizontalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const rotator = toRotation(this.props.Value);
        if (this.state.TipActor) {
            this.state.TipActor.K2_SetActorRotation(rotator, false);
        }
        return (
            <HorizontalBox>
                {this.props.PrefixElement}
                <EditorBox
                    Text={rotator.Pitch.toString()}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyX}
                    Tip={'X'}
                />
                <EditorBox
                    Text={rotator.Yaw.toString()}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyY}
                    Tip={'Y'}
                />
                <EditorBox
                    Text={rotator.Roll.toString()}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyZ}
                    Tip={'Z'}
                />
                {this.state.TipActor ? this.RenderForTip() : this.RenderForNoTip()}
            </HorizontalBox>
        );
    }
}
