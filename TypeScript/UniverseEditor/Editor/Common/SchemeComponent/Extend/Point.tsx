/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { Actor, EditorLevelLibrary, EditorOperations, Vector } from 'ue';

import {
    alignPosA,
    defalutPosA,
    posaToTransform,
    toPosA,
    toVector,
    transformToPosA,
} from '../../../../Common/Interface/Action';
import { IPosA, IVectorInfo } from '../../../../Common/Interface/IAction';
import { MS_PER_SEC } from '../../../../Common/Misc/Async';
import { loadClass } from '../../../../Common/Misc/Util';
import {
    Btn,
    COLOR_LEVEL1,
    DEFUALT_NUMBER_EDIT_TEXT_WIDTH,
    EditorBox,
} from '../../BaseComponent/CommonComponent';
import { ContextBtn } from '../../BaseComponent/ContextBtn';
import LevelEditorUtil from '../../LevelEditorUtil';
import { IProps } from '../../Type';
import { copyObject, pasteObject } from '../../Util';

interface IPointState {
    TipActor: Actor;
}

const tipActorClass = loadClass('/Game/Blueprints/Tip/BP_PosA.BP_PosA_C');

export class Point extends React.Component<IProps<IPosA>, IPointState> {
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
            EditorOperations.GetEditorEvent().OnActorMoved.Remove(this.OnActorMoved);
        }
    }

    private readonly OnModifyX = (text: string): void => {
        const newPosA = Object.assign({}, this.props.Value);
        newPosA.X = parseFloat(text);
        this.SetPosA(newPosA);
    };

    private readonly OnModifyY = (text: string): void => {
        const newPosA = Object.assign({}, this.props.Value);
        newPosA.Y = parseFloat(text);
        this.SetPosA(newPosA);
    };

    private readonly OnModifyZ = (text: string): void => {
        const newPosA = Object.assign({}, this.props.Value);
        newPosA.Z = parseFloat(text);
        this.SetPosA(newPosA);
    };

    private readonly OnModifyAngle = (text: string): void => {
        const newPosA = Object.assign({}, this.props.Value);
        newPosA.Z = parseFloat(text);
        this.SetPosA(newPosA);
    };

    private readonly OnActorMoved = (actor: Actor): void => {
        if (actor !== this.state.TipActor) {
            return;
        }

        setTimeout(() => {
            this.UpPosA();
        }, MS_PER_SEC * 0.1);
    };

    private GenTipActorAtPos(vec: Vector): void {
        const actor = EditorLevelLibrary.SpawnActorFromClass(tipActorClass, vec);
        this.setState({
            TipActor: actor,
        });
        LevelEditorUtil.SelectActor(actor);
        EditorOperations.GetEditorEvent().OnActorMoved.Add(this.OnActorMoved);
    }

    private readonly GenTipActor = (): void => {
        const pos = this.props.Value;
        this.GenTipActorAtPos(toVector(pos));
    };

    private readonly RemoveTipActor = (): void => {
        const actor = this.state.TipActor;
        if (actor) {
            EditorOperations.GetEditorEvent().OnActorMoved.Remove(this.OnActorMoved);

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

        this.SetPosA(toPosA(pos, this.props.Value.A));
    };

    private SetPosA(posa: IPosA): void {
        alignPosA(posa);
        this.props.OnModify(posa, 'normal');
    }

    private readonly UpPosA = (): void => {
        const posA = transformToPosA(this.state.TipActor.GetTransform());
        this.SetPosA(posA);
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

    private RenderForTip(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn Text={'????????????'} Color={COLOR_LEVEL1} OnClick={this.RemoveTipActor} />
                <Btn Text={'???'} OnClick={this.OnClickBtnNav} Tip={'???????????????????????????'} />
            </HorizontalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        const posA = props.Value || defalutPosA;
        const scheme = props.Scheme;
        if (this.state.TipActor) {
            LevelEditorUtil.SetTransform(this.state.TipActor, posaToTransform(posA));
        }
        return (
            <HorizontalBox>
                {this.props.PrefixElement}
                <EditorBox
                    Text={posA.X?.toString() || '0'}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyX}
                    Tip={'X'}
                />
                <EditorBox
                    Text={posA.Y?.toString() || '0'}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyY}
                    Tip={'Y'}
                />
                <EditorBox
                    Text={posA.Z?.toString() || '0'}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyZ}
                    Tip={'Z'}
                />
                <EditorBox
                    Text={posA.A?.toString() || '0'}
                    Width={DEFUALT_NUMBER_EDIT_TEXT_WIDTH}
                    OnChange={this.OnModifyAngle}
                    Tip={'Z??????????????????'}
                />
                {this.state.TipActor ? this.RenderForTip() : this.RenderForNoTip()}
                <ContextBtn
                    Commands={['??????', '??????']}
                    OnCommand={function (cmd: string): void {
                        switch (cmd) {
                            case '??????':
                                copyObject(scheme.Name, posA);
                                break;
                            case '??????': {
                                const pos = pasteObject(scheme.Name);
                                if (pos) {
                                    props.OnModify(pos, 'normal');
                                }
                                break;
                            }
                        }
                    }}
                />
            </HorizontalBox>
        );
    }
}
