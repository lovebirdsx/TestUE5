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
    EFileRoot,
    ESlateSizeRule,
    MyFileHelper,
    World,
} from 'ue';

import { MS_PER_SEC } from '../../Common/Async';
import { log } from '../../Common/Log';
import { readJsonObj, stringifyEditor } from '../../Common/Util';
import { gameConfig } from '../../Game/Common/GameConfig';
import { isEntityClass, isRegistedEntity } from '../../Game/Entity/Common';
import { ITsEntity } from '../../Game/Interface';
import { IEntityData } from '../../Game/Interface/IEntity';
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
    Entity: ITsEntity;
    Data: IEntityData;
}

interface IEntityEditorState {
    Name: string;
    Entity: ITsEntity;
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

    private readonly EntityAddRecrod: Set<ITsEntity> = new Set();

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
        return gameConfig.IsSaveWhileExitPie;
    }

    private set IsSaveWhileExitPie(value: boolean) {
        if (gameConfig.IsSaveWhileExitPie !== value) {
            gameConfig.IsSaveWhileExitPie = value;
            gameConfig.Save();
        }
    }

    private GenEntityEditorJsonPath(entity: ITsEntity): string | undefined {
        // WP 类型的entity
        const pkgPath = EditorOperations.GetExternActorSavePath(entity);
        if (pkgPath) {
            const pathBaseOnContent = pkgPath.substring(6);
            return MyFileHelper.GetPath(EFileRoot.Save, pathBaseOnContent) + '.json';
        }

        // 非WP类型的entity
        const mapContentPath = getContentPackageName(entity);
        return MyFileHelper.GetPath(EFileRoot.Save, `${mapContentPath}_Entities/${entity.Id}.json`);
    }

    private LoadEntityEditorData(entity: ITsEntity): IEntityData | undefined {
        const path = this.GenEntityEditorJsonPath(entity);
        if (!path) {
            return undefined;
        }

        return readJsonObj(path);
    }

    private SaveEntityEditorData(entity: ITsEntity, data: IEntityData): void {
        const entityEditorSavePath = this.GenEntityEditorJsonPath(entity);
        MyFileHelper.Write(entityEditorSavePath, stringifyEditor(data));
    }

    private DeleteEntityEditorData(entity: ITsEntity): void {
        const entityEditorSavePath = this.GenEntityEditorJsonPath(entity);
        MyFileHelper.Remove(entityEditorSavePath);
    }

    private GenEntityState(entity: ITsEntity): IEntityState {
        // 此处不能直接使用LevelDataManager中获得的EntityData
        // 因为其可能由produce产生, 从而不能进行修改操作
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
                        draft.Histories[id].Entity = null;
                        draft.Histories[id].Data = null;
                    }
                });
            });
        });

        entity.OnDestroyed.Remove(this.OnEntityDestory);
    };

    private InitForNewlyAddedEntity(entity: ITsEntity): void {
        entity.Id = currentLevelEntityIdGenerator.GenOne();
        const entityData = entityTemplateManager.GenEntityData(entity);
        levelDataManager.AddEntityData(entity, entityData);
        log(`[${entity.ActorLabel} ${entity.Id}] Added`);
    }

    private readonly OnSelectionChanged = (): void => {
        // 不是马上执行,而延迟一下,是为了避免以下情况:
        // 拷贝粘贴Actor时,此时的Selection还没有转移到新的Actor身上
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

            // 当在编辑器中直接拷贝Entity时, 在AddActor回调后会以被拷贝的Entity进行赋值, 所以在该
            // 回调中进行的赋值操作会被覆盖, 故而在此统一做初始化操作
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
        // 延迟一下再设定状态,否则React会报错
        setTimeout(() => {
            this.setState({
                IsEditorPlaying: false,
            });
        }, 100);
    };

    private CastToEntity(actor: Actor): ITsEntity | undefined {
        if (!actor) {
            return undefined;
        }

        if (!isEntityClass(actor.GetClass())) {
            return undefined;
        }

        const entity = actor as ITsEntity;
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
            msgbox(`你似乎拖入了尚未注册的实体[${actor.ActorLabel}]\n将被自动删除`);
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

        log(`[${entity.ActorLabel} ${entity.Id}] Deleted`);
        levelDataManager.DelEntityData(entity);
        this.DeleteEntityEditorData(entity);

        // 如果删除的是当前选择的Entity, 则需要重新更新选择
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

        // 新增加的Entity还没有正确初始化, levelDataManager不能对其进行操作
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

        // WP地图中, 如果只修改了External Actor, 是不会触发SaveWorld
        // 故而需要再两个地方都处理EntityData的保存过程
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
            return <SlotText Text={'请选择需要编辑的实体'} />;
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
            msgbox(`没有找到Id为[${this.state.IdToSearch}]的实体`);
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
                <Btn Text={'查找'} OnClick={this.FocusOnSearch} />
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
                Name={'地图'}
                Items={[
                    {
                        Name: '【地图配置】生成',
                        Fun: () => levelDataManager.Export(),
                    },
                    {
                        Name: '【地图配置】打开',
                        Fun: () => levelDataManager.OpenMapDataFile(),
                    },
                    {
                        Name: '【存档】打开',
                        Fun: this.OpenSavaFile,
                    },
                    {
                        Name: '【存档】删除',
                        Fun: this.RemoveSavaFile,
                    },
                    {
                        Name: this.state.AutoSaveGame ? '【自动保存】[✓]' : '【自动保存】[  ]',
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
                Name={'数据'}
                Items={[
                    {
                        Name: '【实体】检查当前',
                        Fun: (): void => {
                            if (this.state.Entity) {
                                LevelEditorUtil.CheckEntity(this.state.Entity);
                                log(`检查[${this.state.Entity.ActorLabel}]完毕`);
                            }
                        },
                    },
                    {
                        Name: '【实体】检查所有',
                        Fun: (): void => {
                            LevelEditorUtil.CheckAllEntityData();
                        },
                    },
                    {
                        Name: '【实体】修复当前',
                        Fun: (): void => {
                            if (this.state.Entity) {
                                LevelEditorUtil.CheckAndSaveEntityData(this.state.Entity);
                                log(`检查修复[${this.state.Entity.ActorLabel}]完毕`);
                            }
                        },
                    },
                    {
                        Name: '【实体】修复所有',
                        Fun: () => LevelEditorUtil.CheckAndSaveAllEntityData(),
                    },
                    // {
                    //     Name: '【实体】重新扫描生成id',
                    //     Fun: () => currentLevelEntityIdGenerator.ReScan(),
                    // },
                    {
                        Name: '【模板】重导所有',
                        Fun: () => entityTemplateManager.FixAndExport(),
                    },
                    {
                        Name: '【配置】导出',
                        Fun: () => configExporter.ExportByUser(),
                    },
                    {
                        Name: '【配置】重导',
                        Fun: () => configExporter.ExportByUser(true),
                    },
                ]}
            />
        );
    }

    private RenderTestMenu(): JSX.Element {
        return (
            <MenuBtn
                Name={'测试'}
                Items={[
                    {
                        Name: '【地图】输出信息',
                        Fun: (): void => {
                            const world = EditorLevelLibrary.GetEditorWorld();
                            log(`World: ${world.GetName()}`);
                            log(`Package Path: ${EditorOperations.GetPackagePath(world)}`);
                        },
                    },
                    {
                        Name: '【实体】输出信息',
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
                        Name: '【Id Generator】输出信息',
                        Fun: (): void => {
                            segmentIdGeneratorManager.ShowInfo();
                        },
                    },
                    {
                        Name: '【实体编辑器】输出信息',
                        Fun: (): void => {
                            log(JSON.stringify(this.state.Histories, null, 2));
                        },
                    },
                ]}
            />
        );
    }

    private RenderToolbar(): JSX.Element {
        if (this.state.IsEditorPlaying) {
            return <SlotText Text={'游戏运行中,无法进行编辑'} />;
        }

        return (
            <VerticalBox>
                <HorizontalBox>
                    <Btn
                        Text={'↻'}
                        OnClick={this.Undo}
                        Disabled={!canUndo(this.state)}
                        Tip={`撤销 ${getCommandKeyDesc('Undo')}`}
                    />
                    <Text
                        Text={this.GetUndoStateStr()}
                        Tip={`回退记录,最大支持${editorConfig.MaxHistory}个`}
                    />
                    <Btn
                        Text={'↺'}
                        OnClick={this.Redo}
                        Disabled={!canRedo(this.state)}
                        Tip={`重做 ${getCommandKeyDesc('Redo')}`}
                    />
                    <Text Text={'锁定'} Tip={'锁定后,选择其它Entity将不会改变当前编辑的Entity'} />
                    <Check
                        UnChecked={!this.IsLocked}
                        OnChecked={(checked: boolean): void => {
                            this.IsLocked = checked;
                        }}
                        Tip={'锁定后,选择其它Entity将不会改变当前编辑的Entity'}
                    />
                    <Text Text={'扩展栏'} Tip={'是否显示扩展工具栏'} />
                    <Check
                        UnChecked={!this.state.ShowExtended}
                        OnChecked={(checked: boolean): void => {
                            this.setState({ ShowExtended: checked });
                            editorConfig.IsEntityEditorShowExtendToolBar = checked;
                            editorConfig.Save();
                        }}
                        Tip={'是否显示扩展工具栏'}
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
