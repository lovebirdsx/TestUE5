/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { Border, HorizontalBox, ScrollBox, VerticalBox, VerticalBoxSlot } from 'react-umg';
import {
    Actor,
    EditorLevelLibrary,
    EditorOperations,
    ESlateSizeRule,
    MyFileHelper,
    World,
} from 'ue';

import { config } from '../../Common/Config';
import { isEntityClass, isRegistedEntity } from '../../Common/Interface/Entity';
import { IEntityData, ITsEntityBase } from '../../Common/Interface/IEntity';
import { MS_PER_SEC } from '../../Common/Misc/Async';
import { getSavePath } from '../../Common/Misc/File';
import { log, warn } from '../../Common/Misc/Log';
import { readJsonObj, stringifyEditor } from '../../Common/Misc/Util';
import { Btn, Check, EditorBox, SlotText, Text } from '../Common/BaseComponent/CommonComponent';
import { MenuBtn } from '../Common/BaseComponent/ContextBtn';
import { ErrorBoundary } from '../Common/BaseComponent/ErrorBoundary';
import { formatColor } from '../Common/Color';
import { configExporter } from '../Common/ConfigExporter';
import { editorConfig } from '../Common/EditorConfig';
import { entityTemplateManager } from '../Common/EntityTemplateManager';
import { IEntityRecords } from '../Common/Interface';
import { getCommandKeyDesc } from '../Common/KeyCommands';
import { levelDataManager } from '../Common/LevelDataManager';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { currentLevelEntityIdGenerator } from '../Common/Operations/Entity';
import { entityRegistry } from '../Common/Scheme/Entity';
import { segmentIdGeneratorManager } from '../Common/SegmentIdGenerator';
import { TModifyType } from '../Common/Type';
import {
    deepCopyData,
    genConfigWithoutEditor,
    getContentPackageName,
    mergeEditorToConfig,
    msgbox,
    openFile,
} from '../Common/Util';
import { actorTransactionManager } from './ActorTransactionManager';
import { EntityRecords } from './EntityRecords';
import { EntityView } from './EntityView';
import { LevelEditor } from './LevelEditor';
import { tempEntities } from './TempEntities';

interface IEntityState {
    Entity: ITsEntityBase;
    Data: IEntityData;
}

interface IEntityEditorState {
    Name: string;
    Entity: ITsEntityBase;
    Histories: IEntityState[];
    StepId: number;
    IsEditorPlaying: boolean;
    AutoSaveGame: boolean;
    ShowExtended: boolean;
    IdToSearch: number;
    EntityRecords: IEntityRecords;
}

function canUndo(state: IEntityEditorState): boolean {
    return state.StepId > 0 && state.Histories.length > 0;
}

function canRedo(state: IEntityEditorState): boolean {
    return state.StepId < state.Histories.length - 1;
}

export class EntityEditor extends React.Component<unknown, IEntityEditorState> {
    private LastSavedEntityState: IEntityState;

    private readonly LevelEditor: LevelEditor = new LevelEditor();

    private readonly EntityAddRecrod: Set<ITsEntityBase> = new Set();

    public constructor(props: unknown) {
        super(props);
        const initEntityState = this.GenEntityStateBySelect();
        this.state = {
            Name: 'Hello Entity Editor',
            Entity: LevelEditorUtil.GetSelectedEntity(),
            Histories: [initEntityState],
            StepId: 0,
            AutoSaveGame: this.IsSaveWhileExitPie,
            IsEditorPlaying: LevelEditorUtil.IsPlaying,
            ShowExtended: editorConfig.IsEntityEditorShowExtendToolBar,
            IdToSearch: editorConfig.EntityIdToSearch || 1,
            EntityRecords: editorConfig.EntityRecords,
        };
    }

    private get IsLocked(): boolean {
        return editorConfig.IsEntityEditorLocked;
    }

    private set IsLocked(value: boolean) {
        editorConfig.IsEntityEditorLocked = value;
        editorConfig.Save();

        if (!value) {
            this.OnSelectionChanged();
        }
    }

    private get IsSaveWhileExitPie(): boolean {
        return config.IsSaveWhileExitPie;
    }

    private set IsSaveWhileExitPie(value: boolean) {
        if (config.IsSaveWhileExitPie !== value) {
            config.IsSaveWhileExitPie = value;
            config.Save();
        }
    }

    private GenEntityEditorJsonPath(entity: ITsEntityBase): string | undefined {
        // WP ?????????entity
        const pkgPath = EditorOperations.GetExternActorSavePath(entity);
        if (pkgPath) {
            const pathBaseOnContent = pkgPath.substring(6);
            return getSavePath(pathBaseOnContent) + '.json';
        }

        // ???WP?????????entity
        const mapContentPath = getContentPackageName(entity);
        return getSavePath(`${mapContentPath}_Entities/${entity.Id}.json`);
    }

    private LoadEntityEditorData(entity: ITsEntityBase): IEntityData | undefined {
        const path = this.GenEntityEditorJsonPath(entity);
        if (!path) {
            return undefined;
        }

        return readJsonObj(path);
    }

    private SaveEntityEditorData(entity: ITsEntityBase, data: IEntityData): void {
        const entityEditorSavePath = this.GenEntityEditorJsonPath(entity);
        MyFileHelper.Write(entityEditorSavePath, stringifyEditor(data));
    }

    private DeleteEntityEditorData(entity: ITsEntityBase): void {
        const entityEditorSavePath = this.GenEntityEditorJsonPath(entity);
        MyFileHelper.Remove(entityEditorSavePath);
    }

    private GenEntityState(entity: ITsEntityBase): IEntityState {
        // ????????????????????????LevelDataManager????????????EntityData
        // ??????????????????produce??????, ??????????????????????????????
        const data = deepCopyData(levelDataManager.GetEntityData(entity));
        const editorData = this.LoadEntityEditorData(entity) || {};

        return {
            Entity: entity,
            Data: mergeEditorToConfig(data, editorData),
        };
    }

    private SaveCurrentEntityEditorData(): void {
        const entityState = this.EntityState;
        if (!entityState || !entityState.Entity || this.LastSavedEntityState === entityState) {
            return;
        }

        this.LastSavedEntityState = entityState;
        this.SaveEntityEditorData(entityState.Entity, entityState.Data);
    }

    private GenEntityStateBySelect(): IEntityState {
        const entity = LevelEditorUtil.GetSelectedEntity();
        if (entity) {
            return this.GenEntityState(entity);
        }

        return {
            Entity: undefined,
            Data: undefined,
        };
    }

    private readonly OnEntityDestory = (entity: Actor): void => {
        this.setState((state) => {
            return produce(state, (draft) => {
                state.Histories.forEach((entityState, id) => {
                    if (entityState.Entity === entity) {
                        draft.Histories[id].Entity = undefined;
                        draft.Histories[id].Data = undefined;
                    }
                });
            });
        });

        entity.OnDestroyed.Remove(this.OnEntityDestory);
    };

    private InitForNewlyAddedEntity(entity: ITsEntityBase): void {
        entity.Id = currentLevelEntityIdGenerator.GenOne();
        const entityData = entityTemplateManager.GenEntityData(entity);
        levelDataManager.AddEntityData(entity, entityData);
        log(`[${entity.ActorLabel} ${entity.Id}] Added`);
    }

    private readonly OnSelectionChanged = (): void => {
        // ??????????????????,???????????????,???????????????????????????:
        // ????????????Actor???,?????????Selection????????????????????????Actor??????
        setTimeout(() => {
            if (LevelEditorUtil.IsPlaying) {
                return;
            }

            if (this.IsLocked && this.EntityState.Entity !== undefined) {
                return;
            }

            const entity = LevelEditorUtil.GetSelectedEntity();
            if (!entity || entity === this.EntityState.Entity) {
                return;
            }

            if (tempEntities.Contains(entity)) {
                return;
            }

            // ??????????????????????????????Entity???, ???AddActor???????????????????????????Entity????????????, ????????????
            // ??????????????????????????????????????????, ????????????????????????????????????
            if (this.EntityAddRecrod.size > 0) {
                this.EntityAddRecrod.forEach((entity) => {
                    this.InitForNewlyAddedEntity(entity);
                });
                this.EntityAddRecrod.clear();
            }

            log(`[${entity.ActorLabel} ${entity.Id}] Selected`);

            this.SaveCurrentEntityEditorData();

            const entityState = this.GenEntityState(entity);
            this.RecordEntityState(entityState, 'normal');

            entity.OnDestroyed.Remove(this.OnEntityDestory);
            entity.OnDestroyed.Add(this.OnEntityDestory);
        }, MS_PER_SEC * 0.2);
    };

    private readonly OnPreBeginPie = (): void => {
        configExporter.Export();
    };

    private readonly OnPostSaveWorld = (): void => {
        levelDataManager.Save();
    };

    private readonly OnPreSaveExternalActors = (world: World): void => {
        levelDataManager.Save();
    };

    private readonly OnBeginPie = (): void => {
        this.setState({
            IsEditorPlaying: true,
        });
    };

    private readonly OnEndPie = (): void => {
        // ???????????????????????????,??????React?????????
        setTimeout(() => {
            this.setState({
                IsEditorPlaying: false,
            });
        }, 100);
    };

    private CastToEntity(actor: Actor): ITsEntityBase | undefined {
        if (!actor) {
            return undefined;
        }

        if (!isEntityClass(actor.GetClass())) {
            return undefined;
        }

        const entity = actor as ITsEntityBase;
        if (tempEntities.Contains(entity)) {
            return undefined;
        }

        return entity;
    }

    private readonly OnActorAdded = (actor: Actor): void => {
        const entity = this.CastToEntity(actor);
        if (!entity) {
            return;
        }

        if (!isRegistedEntity(entity)) {
            msgbox(`???????????????????????????????????????[${actor.ActorLabel}]\n??????????????????`);
            EditorLevelLibrary.DestroyActor(actor);
            return;
        }

        this.EntityAddRecrod.add(entity);
    };

    private readonly OnActorDeleted = (actor: Actor): void => {
        const entity = this.CastToEntity(actor);
        if (!entity) {
            return;
        }

        if (!isRegistedEntity(entity)) {
            return;
        }

        // Unreal Editor??????????????????????????????Actor, ???????????????????????????, ????????????
        // ????????????????????????
        this.EntityAddRecrod.delete(entity);
        if (!levelDataManager.ExistEntityId(entity.Id)) {
            warn(`Delete entity [${entity.ActorLabel}] with invalid id [${entity.Id}]`);
            return;
        }

        log(`[${entity.ActorLabel} ${entity.Id}] Deleted`);
        levelDataManager.DelEntityData(entity);
        this.DeleteEntityEditorData(entity);

        // ?????????????????????????????????Entity, ???????????????????????????
        if (this.EntityState.Entity === entity) {
            this.OnEntityDestory(entity);
        }
    };

    private readonly OnActorMoved = (actor: Actor): void => {
        const entity = this.CastToEntity(actor);
        if (!entity) {
            return;
        }

        if (!isRegistedEntity(entity)) {
            return;
        }

        // ????????????Entity????????????????????????, levelDataManager????????????????????????
        if (this.EntityAddRecrod.has(entity)) {
            return;
        }

        const entityData = entityRegistry.GenData(entity);
        levelDataManager.ModifyEntityData(entity, entityData);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public UNSAFE_componentWillMount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Add(this.OnSelectionChanged);
        editorEvent.OnPreBeginPie.Add(this.OnPreBeginPie);
        editorEvent.OnBeginPie.Add(this.OnBeginPie);
        editorEvent.OnEndPie.Add(this.OnEndPie);

        // WP?????????, ??????????????????External Actor, ???????????????SaveWorld
        // ????????????????????????????????????EntityData???????????????
        editorEvent.OnPostSaveWorld.Add(this.OnPostSaveWorld);
        editorEvent.OnPreSaveExternalActors.Add(this.OnPreSaveExternalActors);

        actorTransactionManager.ActorMoved.AddCallback(this.OnActorMoved);
        actorTransactionManager.ActorAdded.AddCallback(this.OnActorAdded);
        actorTransactionManager.ActorDeleted.AddCallback(this.OnActorDeleted);
    }

    public ComponentWillUnmount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Remove(this.OnSelectionChanged);
        editorEvent.OnPreBeginPie.Remove(this.OnPreBeginPie);
        editorEvent.OnBeginPie.Remove(this.OnBeginPie);
        editorEvent.OnEndPie.Remove(this.OnEndPie);

        editorEvent.OnPostSaveWorld.Remove(this.OnPostSaveWorld);
        editorEvent.OnPreSaveExternalActors.Remove(this.OnPreSaveExternalActors);

        actorTransactionManager.ActorMoved.RemoveCallBack(this.OnActorMoved);
        actorTransactionManager.ActorAdded.RemoveCallBack(this.OnActorAdded);
        actorTransactionManager.ActorDeleted.RemoveCallBack(this.OnActorDeleted);
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

                    if (draft.Histories.length > editorConfig.MaxHistory) {
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

    private readonly OnEntityModify = (data: IEntityData, type: TModifyType): void => {
        const es = this.EntityState;
        const newState: IEntityState = {
            Entity: es.Entity,
            Data: data,
        };
        this.RecordEntityState(newState, type);
    };

    private ApplyEntityChange(): void {
        if (this.state.IsEditorPlaying) {
            return;
        }

        const es = this.EntityState;
        if (!es.Entity) {
            return;
        }

        const filteredData = genConfigWithoutEditor(es.Data);
        levelDataManager.ModifyEntityData(es.Entity, filteredData);
    }

    private RenderEntity(): JSX.Element {
        if (this.state.IsEditorPlaying) {
            return undefined;
        }

        const es = this.EntityState;
        if (!es.Entity) {
            return <SlotText Text={'??????????????????????????????'} />;
        }

        return <EntityView Entity={es.Entity} Data={es.Data} OnModify={this.OnEntityModify} />;
    }

    private SetStep(newStepId: number): void {
        this.setState((state) => {
            return {
                StepId: newStepId,
            };
        });
    }

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

    private readonly GetUndoStateStr = (): string => {
        const { state } = this;
        return `${state.StepId + 1} / ${state.Histories.length}`;
    };

    private readonly FocusOnSearch = (): void => {
        const entity = LevelEditorUtil.GetEntity(this.state.IdToSearch);
        if (!entity) {
            msgbox(`????????????Id???[${this.state.IdToSearch}]?????????`);
        } else {
            LevelEditorUtil.Focus(entity);
        }
    };

    private RenderSearchEntity(): JSX.Element {
        return (
            <HorizontalBox>
                <Text Text={'Guid'} />
                <EditorBox
                    Text={this.state.IdToSearch.toString()}
                    OnChange={(text): void => {
                        const id = parseInt(text, 10);
                        this.setState({ IdToSearch: id });
                        editorConfig.EntityIdToSearch = id;
                        editorConfig.Save();
                        this.FocusOnSearch();
                    }}
                />
                <Btn Text={'??????'} OnClick={this.FocusOnSearch} />
            </HorizontalBox>
        );
    }

    private RenderExtendToolbar(): JSX.Element {
        return (
            <VerticalBox>
                <EntityRecords
                    PrefixElement={this.RenderSearchEntity()}
                    Records={this.state.EntityRecords}
                    OnModify={(records, type): void => {
                        this.setState({
                            EntityRecords: records,
                        });
                        editorConfig.EntityRecords = records;
                        editorConfig.Save();
                    }}
                />
            </VerticalBox>
        );
    }

    private RenderLevelMenu(): JSX.Element {
        return (
            <MenuBtn
                Name={'??????'}
                Items={[
                    {
                        Name: '????????????????????????',
                        Fun: () => levelDataManager.Export(),
                    },
                    {
                        Name: '????????????????????????',
                        Fun: () => levelDataManager.OpenMapDataFile(),
                    },
                    {
                        Name: '??????????????????',
                        Fun: this.OpenSavaFile,
                    },
                    {
                        Name: '??????????????????',
                        Fun: this.RemoveSavaFile,
                    },
                    {
                        Name: this.state.AutoSaveGame ? '??????????????????[???]' : '??????????????????[  ]',
                        Fun: () =>
                            this.setState((state) => {
                                return { AutoSaveGame: !state.AutoSaveGame };
                            }),
                    },
                ]}
            />
        );
    }

    private RenderDataMenu(): JSX.Element {
        return (
            <MenuBtn
                Name={'??????'}
                Items={[
                    {
                        Name: '????????????????????????',
                        Fun: (): void => {
                            if (this.state.Entity) {
                                LevelEditorUtil.CheckEntity(this.state.Entity);
                                log(`??????[${this.state.Entity.ActorLabel}]??????`);
                            }
                        },
                    },
                    {
                        Name: '????????????????????????',
                        Fun: (): void => {
                            LevelEditorUtil.CheckAllEntityData();
                        },
                    },
                    {
                        Name: '????????????????????????',
                        Fun: (): void => {
                            if (this.state.Entity) {
                                LevelEditorUtil.CheckAndSaveEntityData(this.state.Entity);
                                log(`????????????[${this.state.Entity.ActorLabel}]??????`);
                            }
                        },
                    },
                    {
                        Name: '????????????????????????',
                        Fun: () => LevelEditorUtil.CheckAndSaveAllEntityData(),
                    },
                    // {
                    //     Name: '??????????????????????????????id',
                    //     Fun: () => currentLevelEntityIdGenerator.ReScan(),
                    // },
                    {
                        Name: '????????????????????????',
                        Fun: () => entityTemplateManager.FixAndExport(),
                    },
                    {
                        Name: '??????????????????',
                        Fun: () => configExporter.ExportByUser(),
                    },
                    {
                        Name: '??????????????????',
                        Fun: () => configExporter.ExportByUser(true),
                    },
                ]}
            />
        );
    }

    private RenderTestMenu(): JSX.Element {
        return (
            <MenuBtn
                Name={'??????'}
                Items={[
                    {
                        Name: '????????????????????????',
                        Fun: (): void => {
                            const world = EditorLevelLibrary.GetEditorWorld();
                            log(`World: ${world.GetName()}`);
                            log(`Package Path: ${EditorOperations.GetPackagePath(world)}`);
                        },
                    },
                    {
                        Name: '????????????????????????',
                        Fun: (): void => {
                            const entity = LevelEditorUtil.GetSelectedEntity();
                            if (entity) {
                                log(`${entity.ActorLabel}:`);
                                log(`  ${EditorOperations.GetExternActorSavePath(entity)}`);
                                log(`  Is dirty = ${EditorOperations.IsDirty(entity)}`);
                            }
                        },
                    },
                    {
                        Name: '???Id Generator???????????????',
                        Fun: (): void => {
                            segmentIdGeneratorManager.ShowInfo();
                        },
                    },
                    {
                        Name: '?????????????????????????????????',
                        Fun: (): void => {
                            log(JSON.stringify(this.state.Histories, undefined, 2));
                        },
                    },
                ]}
            />
        );
    }

    private RenderToolbar(): JSX.Element {
        if (this.state.IsEditorPlaying) {
            return <SlotText Text={'???????????????,??????????????????'} />;
        }

        return (
            <VerticalBox>
                <HorizontalBox>
                    <Btn
                        Text={'???'}
                        OnClick={this.Undo}
                        Disabled={!canUndo(this.state)}
                        Tip={`?????? ${getCommandKeyDesc('Undo')}`}
                    />
                    <Text
                        Text={this.GetUndoStateStr()}
                        Tip={`????????????,????????????${editorConfig.MaxHistory}???`}
                    />
                    <Btn
                        Text={'???'}
                        OnClick={this.Redo}
                        Disabled={!canRedo(this.state)}
                        Tip={`?????? ${getCommandKeyDesc('Redo')}`}
                    />
                    <Text Text={'??????'} Tip={'?????????,????????????Entity??????????????????????????????Entity'} />
                    <Check
                        UnChecked={!this.IsLocked}
                        OnChecked={(checked: boolean): void => {
                            this.IsLocked = checked;
                        }}
                        Tip={'?????????,????????????Entity??????????????????????????????Entity'}
                    />
                    <Text Text={'?????????'} Tip={'???????????????????????????'} />
                    <Check
                        UnChecked={!this.state.ShowExtended}
                        OnChecked={(checked: boolean): void => {
                            this.setState({ ShowExtended: checked });
                            editorConfig.IsEntityEditorShowExtendToolBar = checked;
                            editorConfig.Save();
                        }}
                        Tip={'???????????????????????????'}
                    />
                </HorizontalBox>
                {this.state.ShowExtended && this.RenderExtendToolbar()}
            </VerticalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        this.ApplyEntityChange();
        this.IsSaveWhileExitPie = this.state.AutoSaveGame;

        const scrollBoxSlot: VerticalBoxSlot = {
            Size: { SizeRule: ESlateSizeRule.Fill },
        };

        return (
            <ErrorBoundary>
                <VerticalBox>
                    <Border BrushColor={formatColor('#060606 ue back')}>
                        <VerticalBox>
                            <HorizontalBox>
                                {this.RenderLevelMenu()}
                                {this.RenderDataMenu()}
                                {this.RenderTestMenu()}
                            </HorizontalBox>
                            {this.RenderToolbar()}
                        </VerticalBox>
                    </Border>
                    <ErrorBoundary>
                        <ScrollBox Slot={scrollBoxSlot}>{this.RenderEntity()}</ScrollBox>
                    </ErrorBoundary>
                </VerticalBox>
            </ErrorBoundary>
        );
    }
}
