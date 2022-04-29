/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { Border, HorizontalBox, ScrollBox, VerticalBox, VerticalBoxSlot } from 'react-umg';
import { Actor, EditorLevelLibrary, EditorOperations, ESlateSizeRule, MyFileHelper } from 'ue';

import { isChildOfClass } from '../../Common/Class';
import { log } from '../../Common/Log';
import { TModifyType } from '../../Common/Type';
import { entityRegistry } from '../../Game/Entity/EntityRegistry';
import TsEntity from '../../Game/Entity/TsEntity';
import { ITsEntity, TEntityPureData } from '../../Game/Interface';
import { formatColor } from '../Common/BaseComponent/Color';
import { Btn, SlotText, Text } from '../Common/BaseComponent/CommonComponent';
import { ErrorBoundary } from '../Common/BaseComponent/ErrorBoundary';
import { getCommandKeyDesc } from '../Common/KeyCommands';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { openFile } from '../Common/Util';
import { ConfigFile } from '../FlowEditor/ConfigFile';
import { EntityView } from './EntityView';
import { LevelEditor } from './LevelEditor';

interface IEntityState {
    Entity: ITsEntity;
    PureData: TEntityPureData;
}

interface IEntityEditorState {
    Name: string;
    Entity: ITsEntity;
    Histories: IEntityState[];
    StepId: number;
    IsEditorPlaying: boolean;
}

function canUndo(state: IEntityEditorState): boolean {
    return state.StepId > 0 && state.Histories.length > 0;
}

function canRedo(state: IEntityEditorState): boolean {
    return state.StepId < state.Histories.length - 1;
}

export class EntityEditor extends React.Component<unknown, IEntityEditorState> {
    private LastApplyEntityState: IEntityState;

    private readonly LevelEditor: LevelEditor = new LevelEditor();

    public constructor(props: unknown) {
        super(props);
        const initEntityState = this.GenEntityStateBySelect();
        this.state = {
            Name: 'Hello Entity Editor',
            Entity: this.GetCurrentSelectEntity(),
            Histories: [initEntityState],
            StepId: 0,
            IsEditorPlaying: LevelEditorUtil.IsPlaying,
        };
        this.LastApplyEntityState = initEntityState;
    }

    private GenEntityStateBySelect(): IEntityState {
        const entity = this.GetCurrentSelectEntity();
        if (entity) {
            return {
                Entity: entity,
                PureData: entityRegistry.GenData(entity),
            };
        }

        return {
            Entity: undefined,
            PureData: undefined,
        };
    }

    private GetCurrentSelectEntity(): ITsEntity {
        const actors = EditorLevelLibrary.GetSelectedLevelActors();

        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            if (isChildOfClass(actor, TsEntity)) {
                return actor as ITsEntity;
            }
        }

        return undefined;
    }

    private readonly OnEntityDestory = (entity: Actor): void => {
        this.setState((state) => {
            return produce(state, (draft) => {
                state.Histories.forEach((entityState, id) => {
                    if (entityState.Entity === entity) {
                        draft.Histories[id].Entity = null;
                        draft.Histories[id].PureData = null;
                    }
                });
            });
        });

        entity.OnDestroyed.Remove(this.OnEntityDestory);
    };

    private readonly OnSelectionChanged = (): void => {
        if (LevelEditorUtil.IsPlaying) {
            return;
        }

        const entity = this.GetCurrentSelectEntity();
        if (!entity || entity === this.EntityState.Entity) {
            return;
        }

        const entityState: IEntityState = {
            Entity: entity,
            PureData: entityRegistry.GenData(entity),
        };

        // 记录状态是为了正确更新Actor是否被修改,避免错误标记Actor的dirty状态
        this.LastApplyEntityState = entityState;

        this.RecordEntityState(entityState, 'normal');

        entity.OnDestroyed.Remove(this.OnEntityDestory);
        entity.OnDestroyed.Add(this.OnEntityDestory);
    };

    private readonly OnBeginPie = (): void => {
        this.setState({
            IsEditorPlaying: true,
        });
    };

    private readonly OnEndPie = (): void => {
        // 延迟一下再设定状态,否则React会报错
        setTimeout(() => {
            this.setState({
                IsEditorPlaying: false,
            });
        }, 100);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public UNSAFE_componentWillMount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Add(this.OnSelectionChanged);
        editorEvent.OnBeginPie.Add(this.OnBeginPie);
        editorEvent.OnEndPie.Add(this.OnEndPie);
    }

    public ComponentWillUnmount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Remove(this.OnSelectionChanged);
        editorEvent.OnBeginPie.Remove(this.OnBeginPie);
        editorEvent.OnEndPie.Remove(this.OnEndPie);
    }

    private get EntityState(): IEntityState {
        return this.state.Histories[this.state.StepId];
    }

    private RecordEntityState(entityState: IEntityState, type: TModifyType): void {
        this.setState((state) => {
            const newState = produce(this.state, (draft) => {
                if (type === 'normal') {
                    if (draft.StepId < draft.Histories.length - 1) {
                        draft.Histories.splice(draft.StepId + 1);
                    }

                    draft.Histories.push(entityState);
                    draft.StepId++;

                    if (draft.Histories.length > ConfigFile.MaxHistory) {
                        draft.Histories.shift();
                        draft.StepId--;
                    }
                } else if (type === 'fold') {
                    draft.Histories[state.StepId] = entityState;
                }
            });
            return newState;
        });
    }

    private readonly OnEntityModify = (data: TEntityPureData, type: TModifyType): void => {
        const es = this.EntityState;
        const newState: IEntityState = {
            Entity: es.Entity,
            PureData: data,
        };
        this.RecordEntityState(newState, type);
    };

    private ApplyEntityChange(): void {
        if (this.state.IsEditorPlaying) {
            return;
        }

        const es = this.EntityState;
        LevelEditorUtil.SelectActor(es.Entity);

        if (es === this.LastApplyEntityState || !es.Entity) {
            return;
        }

        entityRegistry.ApplyData(es.PureData, es.Entity);

        // 让ue认为对象已经被修改
        EditorOperations.MarkPackageDirty(es.Entity);

        this.LastApplyEntityState = es;
    }

    private RenderEntity(): JSX.Element {
        if (this.state.IsEditorPlaying) {
            return <SlotText Text={'Editor is playing'} />;
        }

        const es = this.EntityState;
        if (!es.Entity) {
            return <SlotText Text={'select entity to modify'} />;
        }

        return (
            <EntityView Entity={es.Entity} PureData={es.PureData} OnModify={this.OnEntityModify} />
        );
    }

    private SetStep(newStepId: number): void {
        this.setState((state) => {
            return {
                StepId: newStepId,
            };
        });
    }

    private readonly SaveMap = (): void => {
        this.LevelEditor.Save();
    };

    private readonly OpenMapFile = (): void => {
        openFile(this.LevelEditor.GetMapDataPath());
    };

    private readonly OpenSavaFile = (): void => {
        openFile(this.LevelEditor.GetMapSavePath());
    };

    private readonly RemoveSavaFile = (): void => {
        const path = this.LevelEditor.GetMapSavePath();
        MyFileHelper.Remove(path);
        log(`Remove file ${path}`);
    };

    private readonly Undo = (): void => {
        if (!canUndo(this.state)) {
            return;
        }

        this.SetStep(this.state.StepId - 1);
    };

    private readonly Redo = (): void => {
        if (!canRedo(this.state)) {
            return;
        }

        this.SetStep(this.state.StepId + 1);
    };

    private readonly Info = (): void => {
        log(JSON.stringify(this.state.Histories, null, 2));
    };

    private readonly Test = (): void => {
        log(`is playing = ${LevelEditorUtil.IsPlaying}`);
    };

    private readonly GetUndoStateStr = (): string => {
        const { state } = this;
        return `${state.StepId + 1} / ${state.Histories.length}`;
    };

    private RenderToolbar(): JSX.Element {
        if (this.state.IsEditorPlaying) {
            return <SlotText Text={'游戏运行中,无法进行编辑'} />;
        }

        return (
            <VerticalBox>
                <HorizontalBox>
                    <SlotText Text={'地图配置:'} Tip={this.LevelEditor.GetMapDataPath()} />
                    <Btn Text={'保存'} OnClick={this.SaveMap} Tip={`保存场景状态`} />
                    <Btn Text={'打开'} OnClick={this.OpenMapFile} Tip={`打开地图配置文件`} />
                </HorizontalBox>
                <HorizontalBox>
                    <SlotText Text={'存档文件:'} Tip={this.LevelEditor.GetMapSavePath()} />
                    <Btn Text={'打开'} OnClick={this.OpenSavaFile} Tip={`打开游戏存档文件`} />
                    <Btn Text={'删除'} OnClick={this.RemoveSavaFile} Tip={`删除游戏存档文件`} />
                </HorizontalBox>
                <HorizontalBox>
                    <Btn
                        Text={'↻'}
                        OnClick={this.Undo}
                        Disabled={!canUndo(this.state)}
                        Tip={`撤销 ${getCommandKeyDesc('Undo')}`}
                    />
                    <Text
                        Text={this.GetUndoStateStr()}
                        Tip={`回退记录,最大支持${ConfigFile.MaxHistory}个`}
                    />
                    <Btn
                        Text={'↺'}
                        OnClick={this.Redo}
                        Disabled={!canRedo(this.state)}
                        Tip={`重做 ${getCommandKeyDesc('Redo')}`}
                    />
                    <Btn Text={'State'} OnClick={this.Info} Tip={`输出状态`} />
                    <Btn Text={'Test'} OnClick={this.Test} Tip={`测试`} />
                </HorizontalBox>
            </VerticalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        this.ApplyEntityChange();

        const scrollBoxSlot: VerticalBoxSlot = {
            Size: { SizeRule: ESlateSizeRule.Fill },
        };

        return (
            <ErrorBoundary>
                <VerticalBox>
                    <Border BrushColor={formatColor('#060606 ue back')}>
                        <VerticalBox>{this.RenderToolbar()}</VerticalBox>
                    </Border>
                    <ErrorBoundary>
                        <ScrollBox Slot={scrollBoxSlot}>{this.RenderEntity()}</ScrollBox>
                    </ErrorBoundary>
                </VerticalBox>
            </ErrorBoundary>
        );
    }
}
