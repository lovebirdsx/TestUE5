/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { Border, HorizontalBox, ScrollBox, VerticalBox, VerticalBoxSlot } from 'react-umg';
import {
    Actor,
    EditorOperations,
    EFileRoot,
    ESlateSizeRule,
    MyFileHelper,
    Package,
    World,
} from 'ue';

import { MS_PER_SEC } from '../../Common/Async';
import { formatColor } from '../../Common/Color';
import { log, warn } from '../../Common/Log';
import { TModifyType } from '../../Common/Type';
import { msgbox } from '../../Common/UeHelper';
import { readJsonObj, stringifyEditor } from '../../Common/Util';
import { gameConfig } from '../../Game/Common/GameConfig';
import { IEntityData, ITsEntity } from '../../Game/Interface';
import { Btn, Check, EditorBox, SlotText, Text } from '../Common/BaseComponent/CommonComponent';
import { ContextBtn } from '../Common/BaseComponent/ContextBtn';
import { ErrorBoundary } from '../Common/BaseComponent/ErrorBoundary';
import { editorConfig } from '../Common/EditorConfig';
import { IEntityRecords } from '../Common/Interface';
import { getCommandKeyDesc } from '../Common/KeyCommands';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { EditorEntityTemplateOp } from '../Common/Operations/EntityTemplate';
import { entityRegistry } from '../Common/Scheme/Entity';
import { segmentIdGeneratorManager } from '../Common/SegmentIdGenerator';
import { mergeEditorToConfig, openFile } from '../Common/Util';
import { EntityRecords } from './EntityRecords';
import { EntityView } from './EntityView';
import { LevelEditor } from './LevelEditor';
import { tempEntities } from './TempEntities';

const contextCmdList = [
    '检查当前实体数据',
    '检查所有实体数据',
    '修复并导出所有实体数据',
    '检查并修复当前实体数据',
    '修复所有实体模板',
] as const;

type TContextCmd = typeof contextCmdList[number];

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
    private LastApplyEntityState: IEntityState;

    private LastSavedEntityState: IEntityState;

    private readonly LevelEditor: LevelEditor = new LevelEditor();

    public constructor(props: unknown) {
        super(props);
        const initEntityState = this.GenEntityStateBySelect();
        this.state = {
            Name: 'Hello Entity Editor',
            Entity: LevelEditorUtil.GetSelectedEntity(),
            Histories: [initEntityState],
            StepId: 0,
            IsEditorPlaying: LevelEditorUtil.IsPlaying,
            ShowExtended: editorConfig.IsEntityEditorShowExtendToolBar,
            IdToSearch: editorConfig.EntityIdToSearch || 1,
            EntityRecords: editorConfig.EntityRecords,
        };
        this.LastApplyEntityState = initEntityState;
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
        gameConfig.IsSaveWhileExitPie = value;
        gameConfig.Save();
    }

    private GenEntityEditorJsonPath(entity: ITsEntity): string | undefined {
        const pkgPath = EditorOperations.GetExternActorSavePath(entity);
        if (!pkgPath) {
            return undefined;
        }

        const pathBaseOnContent = pkgPath.substring(6);
        return MyFileHelper.GetPath(EFileRoot.Save, pathBaseOnContent) + '.json';
    }

    private LoadEntityEditorData(entity: ITsEntity): IEntityData | undefined {
        const path = this.GenEntityEditorJsonPath(entity);
        if (!path) {
            return undefined;
        }

        return readJsonObj(path);
    }

    private TryRemoveEntityEditorDataByPackage(pkg: Package): void {
        const pkgPath = pkg.GetName();
        if (!pkgPath.includes('__ExternalActors__')) {
            return;
        }

        const pathBaseOnContent = pkgPath.substring(6);
        const path = MyFileHelper.GetPath(EFileRoot.Save, pathBaseOnContent) + '.json';
        MyFileHelper.Remove(path);
    }

    private SaveEntityEditorData(entity: ITsEntity, data: IEntityData): void {
        const entityEditorSavePath = this.GenEntityEditorJsonPath(entity);
        if (!entityEditorSavePath) {
            return;
        }

        MyFileHelper.Write(entityEditorSavePath, stringifyEditor(data));
    }

    private GenEntityState(entity: ITsEntity): IEntityState {
        const data = entityRegistry.GenData(entity);
        if (entityRegistry.IsDataModified(entity, data)) {
            entityRegistry.ApplyData(data, entity);
            EditorOperations.MarkPackageDirty(entity);
            warn(`[${entity.ActorLabel}]: Auto fix entity data`);
        }

        const editorData = this.LoadEntityEditorData(entity);
        if (editorData) {
            mergeEditorToConfig(data, editorData);
        }

        return {
            Entity: entity,
            Data: data,
        };
    }

    private SaveCurrentEntity(): void {
        const entityState = this.EntityState;
        if (!entityState || !entityState.Entity || this.LastSavedEntityState === entityState) {
            return;
        }

        this.LastSavedEntityState = entityState;
        LevelEditorUtil.CheckAndSaveEntityData(entityState.Entity);

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

            this.SaveCurrentEntity();

            const entityState = this.GenEntityState(entity);

            // 记录状态是为了正确更新Actor是否被修改,避免错误标记Actor的dirty状态
            this.LastApplyEntityState = entityState;

            this.RecordEntityState(entityState, 'normal');

            entity.OnDestroyed.Remove(this.OnEntityDestory);
            entity.OnDestroyed.Add(this.OnEntityDestory);
        }, MS_PER_SEC * 0.2);
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

    private readonly OnPreSaveExternalActors = (world: World): void => {
        this.SaveCurrentEntity();
    };

    private readonly OnPackageRemoved = (pkg: Package): void => {
        LevelEditorUtil.TryRemoveEntityByPackage(pkg);
        this.TryRemoveEntityEditorDataByPackage(pkg);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public UNSAFE_componentWillMount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Add(this.OnSelectionChanged);
        editorEvent.OnBeginPie.Add(this.OnBeginPie);
        editorEvent.OnEndPie.Add(this.OnEndPie);
        editorEvent.OnPreSaveExternalActors.Add(this.OnPreSaveExternalActors);
        editorEvent.OnPackageRemoved.Add(this.OnPackageRemoved);
    }

    public ComponentWillUnmount(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnSelectionChanged.Remove(this.OnSelectionChanged);
        editorEvent.OnBeginPie.Remove(this.OnBeginPie);
        editorEvent.OnEndPie.Remove(this.OnEndPie);
        editorEvent.OnPreSaveExternalActors.Remove(this.OnPreSaveExternalActors);
        editorEvent.OnPackageRemoved.Remove(this.OnPackageRemoved);
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
        if (es === this.LastApplyEntityState || !es.Entity) {
            return;
        }

        if (entityRegistry.ApplyData(es.Data, es.Entity)) {
            EditorOperations.MarkPackageDirty(es.Entity);
        }

        this.LastApplyEntityState = es;
    }

    private RenderEntity(): JSX.Element {
        if (this.state.IsEditorPlaying) {
            return <SlotText Text={'编辑器正在运行,无法进行编辑'} />;
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

    private readonly Info = (): void => {
        log(JSON.stringify(this.state.Histories, null, 2));
    };

    private readonly Test = (): void => {
        // Test Case 1
        // log(`is playing = ${LevelEditorUtil.IsPlaying}`);
        //
        // Test Case 2
        // const entity = LevelEditorUtil.GetSelectedEntity();
        // if (entity) {
        //     log(`${entity.ActorLabel}: ${EditorOperations.GetExternActorSavePath(entity)}`);
        //     log(`${entity.ActorLabel}: ${LevelEditorUtil.GetEntityJsonPath(entity)}`);
        //     log(`${entity.ActorLabel}: Is dirty = ${EditorOperations.IsActorDirty(entity)}`);
        // }
        //
        // Test Case 3
        // const world = EditorLevelLibrary.GetEditorWorld();
        // log(`World: ${world.GetName()} Package Path: ${EditorOperations.GetPackagePath(world)}`);
        //
        // Test Case 4
        // const entityDatas = LevelTools.GetAllEntityTemplatePath();
        // entityDatas.forEach((data) => {
        //     log(data);
        // });
        //
        // Test Case 5
        // const entity = LevelEditorUtil.GetSelectedEntity();
        // if (entity) {
        //     log(`[${entity.ActorLabel}] [${entity.Id}]`);
        // }
        //
        // Test Case 6
        segmentIdGeneratorManager.ShowInfo();
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

    private readonly OnContextCmd = (cmd: TContextCmd): void => {
        switch (cmd) {
            case '检查当前实体数据':
                if (this.state.Entity) {
                    LevelEditorUtil.CheckEntity(this.state.Entity);
                    log(`检查[${this.state.Entity.ActorLabel}]完毕`);
                }
                break;

            case '检查所有实体数据':
                LevelEditorUtil.CheckAllEntityData();
                break;

            case '检查并修复当前实体数据':
                if (this.state.Entity) {
                    LevelEditorUtil.CheckAndSaveEntityData(this.state.Entity);
                    log(`检查修复[${this.state.Entity.ActorLabel}]完毕`);
                }
                break;

            case '修复并导出所有实体数据':
                LevelEditorUtil.CheckAndSaveAllEntityData();
                break;

            case '修复所有实体模板':
                EditorEntityTemplateOp.FixAllTemplateId();
                break;
        }
    };

    private RenderToolbar(): JSX.Element {
        if (this.state.IsEditorPlaying) {
            return <SlotText Text={'游戏运行中,无法进行编辑'} />;
        }

        return (
            <VerticalBox>
                <HorizontalBox>
                    <Text Text={'数据文件:'} Tip={this.LevelEditor.GetMapDataPath()} />
                    <Btn
                        Text={'保存'}
                        OnClick={(): void => {
                            this.LevelEditor.SaveMapData();
                        }}
                        Tip={`保存场景状态`}
                    />
                    <Btn
                        Text={'打开'}
                        OnClick={(): void => {
                            this.LevelEditor.OpenMapDataFile();
                        }}
                        Tip={`打开地图配置文件`}
                    />
                </HorizontalBox>
                <HorizontalBox>
                    <Text Text={'存档文件:'} Tip={this.LevelEditor.GetMapSavePath()} />
                    <Btn Text={'打开'} OnClick={this.OpenSavaFile} Tip={'打开游戏存档文件'} />
                    <Btn Text={'删除'} OnClick={this.RemoveSavaFile} Tip={'删除游戏存档文件'} />
                    <Text Text={'保存游戏'} Tip={'退出Pie时,是否自动保存游戏'} />
                    <Check
                        UnChecked={!this.IsSaveWhileExitPie}
                        OnChecked={(checked: boolean): void => {
                            this.IsSaveWhileExitPie = checked;
                        }}
                        Tip={'退出Pie时,是否自动保存游戏'}
                    />
                    <ContextBtn
                        Commands={contextCmdList as unknown as string[]}
                        OnCommand={this.OnContextCmd}
                    />
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
                    <Btn Text={'状态'} OnClick={this.Info} Tip={`输出状态`} />
                    <Btn Text={'测试'} OnClick={this.Test} Tip={`测试`} />
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
