/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import {
    Actor,
    EditorLevelLibrary,
    EDrawDebugTrace,
    ETraceTypeQuery,
    HitResult,
    KismetSystemLibrary,
    Rotator,
    Vector,
} from 'ue';

import { IProps } from '../../../../Common/Type';
import { alignVector } from '../../../../Common/Util';
import { IVectorInfo } from '../../../../Game/Flow/Action';
import {
    Btn,
    DEFUALT_NUMBER_EDIT_TEXT_WIDTH,
    EditorBox,
} from '../../BaseComponent/CommonComponent';
import LevelEditorUtil from '../../LevelEditorUtil';

interface IPointState {
    TipActor: Actor;
}

export class Point extends React.Component<IProps<IVectorInfo>, IPointState> {
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
        this.SetPosition(new Vector(newPos.X, newPos.Y, newPos.Z));
    };

    private readonly OnModifyY = (text: string): void => {
        const newPos = Object.assign({}, this.props.Value);
        newPos.Y = parseFloat(text);
        this.SetPosition(new Vector(newPos.X, newPos.Y, newPos.Z));
    };

    private readonly OnModifyZ = (text: string): void => {
        const newPos = Object.assign({}, this.props.Value);
        newPos.Z = parseFloat(text);
        this.SetPosition(new Vector(newPos.X, newPos.Y, newPos.Z));
    };

    private GenTipActorAtPos(vec: Vector): void {
        const actor = EditorLevelLibrary.SpawnActorFromClass(Actor.StaticClass(), vec);
        this.setState({
            TipActor: actor,
        });
    }

    private readonly GenTipActor = (): void => {
        const pos = this.props.Value;
        const location = new Vector(pos.X, pos.Y, pos.Z);
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
        const cameraPos = new Vector();
        const rotator = new Rotator();
        EditorLevelLibrary.GetLevelViewportCameraInfo($ref(cameraPos), $ref(rotator));
        const dir = rotator.Quaternion().GetForwardVector();
        const endPos = cameraPos.op_Addition(dir.op_Multiply(100 * 100));
        const hitResult = new HitResult();
        const ok = KismetSystemLibrary.LineTraceSingle(
            EditorLevelLibrary.GetEditorWorld(),
            cameraPos,
            endPos,
            ETraceTypeQuery.Camera,
            false,
            undefined,
            EDrawDebugTrace.ForDuration,
            $ref(hitResult),
            true,
        );

        const pos = ok ? hitResult.ImpactPoint : cameraPos;
        if (!this.state.TipActor) {
            this.GenTipActorAtPos(pos);
        }

        this.SetPosition(pos);
    };

    private SetPosition(vec: Vector): void {
        const vecAligned = alignVector(vec);
        if (this.state.TipActor) {
            this.state.TipActor.K2_SetActorLocation(vec, false, undefined, false);
        }
        const pos: IVectorInfo = { X: vecAligned.X, Y: vecAligned.Y, Z: vecAligned.Z };
        this.props.OnModify(pos, 'normal');
    }

    private readonly UpPosition = (): void => {
        const pos = this.state.TipActor.K2_GetActorLocation();
        this.SetPosition(pos);
    };

    private readonly OnClickBtnNav = (): void => {
        LevelEditorUtil.SelectActor(this.state.TipActor);
        LevelEditorUtil.FocusSelected();
    };

    private RenderForNoTip(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn
                    Text={'生成指示'}
                    OnClick={this.GenTipActor}
                    Tip={'在地图中生成目标点指示的Actor,调整完毕后记得要删除'}
                />
                <Btn
                    Text={'当前镜头'}
                    OnClick={this.SetToCurrentCamera}
                    Tip={'将位置设定到当前镜头位置'}
                />
            </HorizontalBox>
        );
    }

    private RenderForTip(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn Text={'移除指示'} OnClick={this.RemoveTipActor} />
                <Btn Text={'更新位置'} OnClick={this.UpPosition} />
                <Btn Text={'◉'} OnClick={this.OnClickBtnNav} Tip={'在场景中选中提示点'} />
            </HorizontalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const pos = this.props.Value;
        if (this.state.TipActor) {
            const vecPos = new Vector(pos.X, pos.Y, pos.Z);
            this.state.TipActor.K2_SetActorLocation(vecPos, false, undefined, false);
            LevelEditorUtil.SelectActor(this.state.TipActor);
            LevelEditorUtil.FocusSelected();
        }
        return (
            <HorizontalBox>
                {this.props.PrefixElement}
                <EditorBox
                    Text={pos.X.toString()}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyX}
                    Tip={'X'}
                />
                <EditorBox
                    Text={pos.Y.toString()}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyY}
                    Tip={'Y'}
                />
                <EditorBox
                    Text={pos.Z.toString()}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyZ}
                    Tip={'Z'}
                />
                {this.state.TipActor ? this.RenderForTip() : this.RenderForNoTip()}
            </HorizontalBox>
        );
    }
}
