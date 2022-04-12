/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { Border, HorizontalBox, ScrollBox, VerticalBox, VerticalBoxSlot } from 'react-umg';
import { EditorLevelLibrary, EditorOperations, ESlateSizeRule } from 'ue';

import { isChildOfClass } from '../../Common/Class';
import TsEntity from '../../Game/Entity/TsEntity';
import { formatColor } from '../Common/Component/Color';
import { Btn, Text } from '../Common/Component/CommonComponent';
import { ErrorBoundary } from '../Common/Component/ErrorBoundary';
import { getCommandKeyDesc } from '../Common/KeyCommands';
import LevelEditor from '../Common/LevelEditor';
import { entityScheme } from '../Common/Scheme/Entity/Index';
import { TModifyType } from '../Common/Scheme/Type';
import { ConfigFile } from '../FlowEditor/ConfigFile';
import { EntityView } from './EntityView';

interface IEntityState {
    Entity: TsEntity;
    PureData: Record<string, unknown>;
}

interface IEntityEditorState {
    Name: string;
    Entity: TsEntity;
    Histories: IEntityState[];
    StepId: number;
}

function canUndo(state: IEntityEditorState): boolean {
    return state.StepId > 0 && state.Histories.length > 0;
}

function canRedo(state: IEntityEditorState): boolean {
    return state.StepId < state.Histories.length - 1;
}

export class EntityEditor extends React.Component<unknown, IEntityEditorState> {
    private LastApplyEntityState: IEntityState;

    public constructor(props: unknown) {
        super(props);
        const initEntityState = this.GenEntityStateBySelect();
        this.state = {
            Name: 'Hello Entity Editor',
            Entity: this.GetCurrentSelectEntity(),
            Histories: [initEntityState],
            StepId: 0,
        };
        this.LastApplyEntityState = initEntityState;
    }

    private GenEntityStateBySelect(): IEntityState {
        const entity = this.GetCurrentSelectEntity();
        if (entity) {
            return {
                Entity: entity,
                PureData: entityScheme.GenData(entity),
            };
        }

        return {
            Entity: undefined,
            PureData: undefined,
        };
    }

    private GetCurrentSelectEntity(): TsEntity | null {
        const actors = EditorLevelLibrary.GetSelectedLevelActors();
        if (actors.Num() !== 1) {
            return null;
        }

        const actor = actors.Get(0);
        if (isChildOfClass(actor, TsEntity)) {
            return actor as TsEntity;
        }

        return null;
    }

    private readonly OnSelectionChanged = (): void => {
        const entity = this.GetCurrentSelectEntity();
        if (entity === null || entity === this.EntityState.Entity) {
            return;
        }

        const entityState: IEntityState = {
            Entity: entity,
            PureData: entityScheme.GenData(entity),
        };
        this.RecordEntityState(entityState, 'normal');
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public UNSAFE_componentWillMount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Add(this.OnSelectionChanged);
    }

    public ComponentWillUnmount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Remove(this.OnSelectionChanged);
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

    private readonly OnEntityModify = (data: Record<string, unknown>, type: TModifyType): void => {
        const es = this.EntityState;
        const newState: IEntityState = {
            Entity: es.Entity,
            PureData: data,
        };
        this.RecordEntityState(newState, type);
    };

    private ApplyEntityChange(): void {
        const es = this.EntityState;
        LevelEditor.SelectActor(es.Entity);

        if (es === this.LastApplyEntityState || !es.Entity) {
            return;
        }

        entityScheme.ApplyData(es.PureData, es.Entity);
        this.LastApplyEntityState = es;
    }

    private RenderEntity(): JSX.Element {
        const es = this.EntityState;
        if (!es.Entity) {
            return <Text Text={'select entity to modify'} />;
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

    private readonly GetUndoStateStr = (): string => {
        const { state } = this;
        return `${state.StepId + 1} / ${state.Histories.length}`;
    };

    private RenderToolbar(): JSX.Element {
        return (
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
            </HorizontalBox>
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
