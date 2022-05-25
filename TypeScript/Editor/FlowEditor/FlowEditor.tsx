/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { Border, HorizontalBox, ScrollBox, VerticalBox, VerticalBoxSlot } from 'react-umg';
import { EditorOperations, EMsgResult, EMsgType, ESlateSizeRule } from 'ue';

import { formatColor } from '../../Common/Color';
import { log } from '../../Common/Log';
import { TModifyType } from '../../Common/Type';
import {
    errorbox,
    msgbox,
    openLoadCsvFileDialog,
    openSaveCsvFileDialog,
} from '../../Common/UeHelper';
import { EFlowListAction, flowListContext } from '../../Game/Common/Operations/FlowList';
import { IFlowListInfo } from '../../Game/Flow/Action';
import { Btn, Check, ErrorText, SlotText, Text } from '../Common/BaseComponent/CommonComponent';
import { ContextBtn } from '../Common/BaseComponent/ContextBtn';
import { ErrorBoundary } from '../Common/BaseComponent/ErrorBoundary';
import { editorConfig } from '../Common/EditorConfig';
import { getCommandKeyDesc, KeyCommands } from '../Common/KeyCommands';
import { editorFlowListOp } from '../Common/Operations/FlowList';
import { FlowList } from '../Common/SchemeComponent/Public';
import { openDirOfFile, openFile } from '../Common/Util';
import { TalkListTool } from './TalkListTool';

interface IFlowEditorState {
    Histories: IFlowListInfo[];
    StepId: number;
    Saved: IFlowListInfo;
    IsDevelop: boolean;
    OpenError: string;
}

function canUndo(state: IFlowEditorState): boolean {
    return state.StepId > 0 && state.Histories.length > 0;
}

function canRedo(state: IFlowEditorState): boolean {
    return state.StepId < state.Histories.length - 1;
}

export class FlowEditor extends React.Component<unknown, IFlowEditorState> {
    private readonly CommandHandles: number[] = [];

    private AutoSaveHander: NodeJS.Timer;

    private LastModifyTime: number;

    private LastSaveFailState: IFlowListInfo;

    private TimeSecond: number;

    public constructor(props: unknown) {
        super(props);
        this.state = this.LoadState();
    }

    private RegKeyCommands(): void {
        const kc = KeyCommands.GetInstance();
        this.CommandHandles.push(kc.AddCommandCallback('Save', this.Save));
        this.CommandHandles.push(kc.AddCommandCallback('SaveAs', this.SaveByDialog));
        this.CommandHandles.push(kc.AddCommandCallback('Open', this.OpenByDialog));
        this.CommandHandles.push(kc.AddCommandCallback('New', this.NewByDialog));
        this.CommandHandles.push(kc.AddCommandCallback('Redo', this.Redo));
        this.CommandHandles.push(kc.AddCommandCallback('Undo', this.Undo));
        this.CommandHandles.push(kc.AddCommandCallback('ClearConsole', this.ClearConsole));
        this.CommandHandles.push(kc.AddCommandCallback('ToggleDevelop', this.ToggleDevelop));
    }

    private RemKeyCommands(): void {
        const kc = KeyCommands.GetInstance();
        this.CommandHandles.forEach((handle) => {
            kc.RemoveCommandCallback(handle);
        });
    }

    private StartAutoSave(): void {
        const autoSaveInterval = 1000;
        this.AutoSaveHander = setInterval(this.DetectAutoSave, autoSaveInterval);
        this.TimeSecond = 0;
    }

    private TrySave(): boolean {
        if (!this.NeedSave()) {
            return false;
        }

        if (this.FlowList === this.LastSaveFailState) {
            return false;
        }

        this.Save();
        return true;
    }

    private readonly DetectAutoSave = (): void => {
        this.TimeSecond++;
        if (this.TimeSecond - this.LastModifyTime < editorConfig.AutoSaveInterval) {
            return;
        }

        if (this.TrySave()) {
            log('Auto save triggered');
        }
    };

    private StopAutoSave(): void {
        clearInterval(this.AutoSaveHander);
    }

    private readonly OnPreBeginPie = (): void => {
        this.TrySave();
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public UNSAFE_componentWillMount(): void {
        this.RegKeyCommands();
        this.StartAutoSave();
        EditorOperations.GetEditorEvent().OnPreBeginPie.Add(this.OnPreBeginPie);

        // 由于子Component中会访问 FlowListContext, 所以不能在componentDidMout中调用
        // 没有在componentWillMount中调用,是因为会报警告
        // 参考 https://github.com/facebook/react/issues/5737
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        flowListContext.Set(
            () => this.FlowList,
            (flowList, type) => {
                if (type === EFlowListAction.ModifyText) {
                    this.ModifyFlowList(flowList, 'normal');
                } else if (type === EFlowListAction.GenText) {
                    this.ModifyFlowList(flowList, 'normal', true);
                }
            },
        );
    }

    public ComponentWillUnmount(): void {
        this.RemKeyCommands();
        this.StopAutoSave();
        flowListContext.Clear();
        EditorOperations.GetEditorEvent().OnPreBeginPie.Remove(this.OnPreBeginPie);
    }

    private get FlowList(): IFlowListInfo {
        return this.state.Histories[this.state.StepId];
    }

    private LoadState(path?: string): IFlowEditorState {
        // 保存编辑器配置
        if (path) {
            editorConfig.FlowConfigPath = path;
            editorConfig.Save();
        }

        // 加载剧情配置
        let flowListConfig: IFlowListInfo = undefined;
        let openError: string = undefined;
        try {
            flowListConfig = editorFlowListOp.Load(editorConfig.FlowConfigPath);
        } catch (e: unknown) {
            let errorStr: string = undefined;
            if (typeof e === 'string') {
                errorStr = e;
            } else if (e instanceof Error) {
                errorStr = e.message;
            }
            openError = `打开配置文件出错(流程配置文件不是Text_开头的文件哟!)\n\n[${editorConfig.FlowConfigPath}]\n${errorStr}`;
        }

        // 如果有PlayFlow, 则折叠相应的flow和state
        if (editorConfig.LastPlayFlow) {
            editorFlowListOp.FoldForPlayFlow(flowListConfig, editorConfig.LastPlayFlow);
            editorConfig.LastPlayFlow = undefined;
            editorConfig.Save();
        }

        return {
            Histories: [flowListConfig],
            StepId: 0,
            Saved: flowListConfig,
            IsDevelop: editorConfig.IsDevelop,
            OpenError: openError,
        };
    }

    private Open(path: string): void {
        this.setState(this.LoadState(path));
    }

    private OpenFlowListConfigDir(): void {
        openDirOfFile(editorConfig.FlowConfigPath);
    }

    private OpenFlowListConfig(): void {
        openFile(editorConfig.FlowConfigPath);
    }

    private CheckSave(): boolean {
        if (this.NeedSave()) {
            const result = EditorOperations.ShowMessage(
                EMsgType.YesNoCancel,
                '当前配置已经修改,需要保存吗?',
            );
            if (result === EMsgResult.Cancel) {
                return false;
            } else if (result === EMsgResult.Yes) {
                this.Save();
            }
        }

        return true;
    }

    private readonly OpenByDialog = (): void => {
        const openPath = openLoadCsvFileDialog(editorConfig.FlowConfigPath);
        if (!openPath) {
            return;
        }

        if (!this.CheckSave()) {
            return;
        }

        if (openPath !== editorConfig.FlowConfigPath) {
            this.Open(openPath);
        }
    };

    private readonly NewByDialog = (): void => {
        if (!this.CheckSave()) {
            return;
        }

        this.Open(editorFlowListOp.GenNewFlowListFile());
    };

    private readonly Save = (): void => {
        const messages: string[] = [];
        if (editorFlowListOp.Check(this.FlowList, messages) > 0) {
            errorbox(`保存失败，错误：\n${messages.join('\n')}`);
            this.LastSaveFailState = this.FlowList;
            return;
        }

        editorConfig.Save();

        // 此处不能直接使用this.flowList,因为会修改其内容
        // React修改state中的内容,只能在setState中进行
        const flowListToSave = produce(this.FlowList, (draft) => {
            const removeCount = editorFlowListOp.FormatTexts(draft);
            if (removeCount > 0) {
                log(`remove ${removeCount} text ids`);
            }
        });

        editorFlowListOp.Save(flowListToSave, editorConfig.FlowConfigPath);

        this.setState({
            Saved: this.FlowList,
        });
    };

    private NeedSave(): boolean {
        return this.FlowList !== this.state.Saved;
    }

    private readonly SaveByDialog = (): void => {
        const openPath = openSaveCsvFileDialog(editorConfig.FlowConfigPath);
        if (!openPath) {
            return;
        }

        if (openPath !== editorConfig.FlowConfigPath) {
            editorConfig.FlowConfigPath = openPath;
            this.Save();
            this.Open(openPath);
        } else {
            this.Save();
        }
    };

    private RecordState(
        state: Readonly<IFlowEditorState>,
        flowConfig: IFlowListInfo,
        draft: IFlowEditorState,
    ): void {
        draft.Histories.splice(state.StepId + 1);
        draft.Histories.push(flowConfig);
        if (draft.Histories.length > editorConfig.MaxHistory) {
            draft.Histories.shift();
            draft.StepId = editorConfig.MaxHistory - 1;
        } else {
            draft.StepId = state.StepId + 1;
        }
        this.LastModifyTime = this.TimeSecond;
    }

    private readonly Undo = (): void => {
        this.setState((state) =>
            produce(state, (draft) => {
                if (!canUndo(state)) {
                    return;
                }

                draft.StepId = state.StepId - 1;
            }),
        );
    };

    private readonly Redo = (): void => {
        this.setState((state) =>
            produce(state, (draft) => {
                if (!canRedo(state)) {
                    return;
                }

                draft.StepId = state.StepId + 1;
            }),
        );
    };

    private readonly GetUndoStateStr = (): string => {
        const { state } = this;
        return `${state.StepId + 1} / ${state.Histories.length}`;
    };

    private readonly Export = (): void => {
        const path = openSaveCsvFileDialog(editorConfig.CsvExportPath);
        if (!path) {
            return;
        }

        editorConfig.CsvExportPath = path;
        editorConfig.Save();

        TalkListTool.Export(this.FlowList, path);
        log(`Export flowlist to ${path} succeed`);
    };

    private readonly Import = (): void => {
        const path = openLoadCsvFileDialog(editorConfig.CsvImportPath);
        if (!path) {
            return;
        }

        editorConfig.CsvImportPath = path;
        editorConfig.Save();

        let listInfo: IFlowListInfo = null;
        try {
            listInfo = TalkListTool.Import(path);
        } catch (e) {
            msgbox(`导入失败:${e}`);
            return;
        }

        this.ModifyFlowList(listInfo, 'normal');
        log(`Import flowlist from ${path} succeed`);
    };

    private readonly ModifyFlowList = (
        newConfig: IFlowListInfo,
        type: TModifyType,
        noRecord?: boolean,
    ): void => {
        if (noRecord || type === 'fold') {
            this.setState((state) =>
                produce(state, (draft) => {
                    draft.Histories[draft.StepId] = newConfig;

                    // 修正已经保存的点，避免不必要的状态
                    if (state.Saved === state.Histories[state.StepId]) {
                        draft.Saved = newConfig;
                    }
                }),
            );
        } else {
            this.setState((state) =>
                produce(state, (draft) => {
                    this.RecordState(state, newConfig, draft);
                }),
            );
        }
    };

    private readonly LogHistory = (): void => {
        EditorOperations.ClearLogWindow();
        log(JSON.stringify(this.state.Histories, null, 2));
    };

    private readonly LogFlowInfo = (): void => {
        EditorOperations.ClearLogWindow();
        log(JSON.stringify(this.FlowList, null, 2));
    };

    private readonly ClearConsole = (): void => {
        EditorOperations.ClearLogWindow();
    };

    private readonly ToggleDevelop = (): void => {
        editorConfig.IsDevelop = !editorConfig.IsDevelop;
        editorConfig.Save();
        this.setState({
            IsDevelop: editorConfig.IsDevelop,
        });
    };

    private RenderError(): JSX.Element {
        const errors: string[] = [];
        const flowList = this.FlowList;
        editorFlowListOp.Check(flowList, errors);
        if (errors.length <= 0) {
            return undefined;
        }

        return (
            <VerticalBox>
                <HorizontalBox>
                    <Btn
                        Text={'自动修复'}
                        OnClick={(): void => {
                            const newFlowList = produce(flowList, (draft) => {
                                editorFlowListOp.Fix(draft);
                            });
                            if (newFlowList !== flowList) {
                                this.ModifyFlowList(newFlowList, 'normal');
                            }
                        }}
                    />
                </HorizontalBox>
                {errors.map((err, id) => (
                    <ErrorText key={id} Text={err} />
                ))}
            </VerticalBox>
        );
    }

    private RenderDevelopElements(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn
                    Text={'导出对话...'}
                    OnClick={this.Export}
                    Tip={'导出对话列表到CSV文件中,具体请参考【流程编辑器】使用说明'}
                />
                <Btn Text={'History'} OnClick={this.LogHistory} />
                <Btn Text={'Flow info'} OnClick={this.LogFlowInfo} />
                <Btn
                    Text={'Clear Console'}
                    OnClick={this.ClearConsole}
                    Tip={`清空控制台 ${getCommandKeyDesc('ClearConsole')}`}
                />
                <Check
                    UnChecked={!EditorOperations.GetIfWaitJSDebug()}
                    OnChecked={(checked): void => {
                        EditorOperations.SetIfWaitJSDebug(checked);
                    }}
                />
                <Text
                    Text="Wait Debugger"
                    Tip="等待TS的调试器, 若选中, 则程序等待, 直到调试器连接后才继续执行"
                />
            </HorizontalBox>
        );
    }

    private readonly OnFlowListContextCommand = (cmd: string): void => {
        switch (cmd) {
            case '打开':
                this.OpenFlowListConfig();
                break;
            case '目录':
                this.OpenFlowListConfigDir();
                break;
            default:
                break;
        }
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const scrollBoxSlot: VerticalBoxSlot = {
            Size: { SizeRule: ESlateSizeRule.Fill },
        };
        return (
            <VerticalBox>
                <Border BrushColor={formatColor('#060606 ue back')}>
                    <VerticalBox>
                        {/* <Text text={`编辑器配置路径: ${cfg.ConfigFile.savePath}`}></Text> */}
                        <HorizontalBox>
                            <SlotText
                                Text={`${this.NeedSave() ? '*' : ''}${editorConfig.FlowConfigPath}`}
                                Tip="当前打开的剧情配置文件路径(相对于Content目录)"
                            />
                            <ContextBtn
                                Commands={['打开', '目录']}
                                OnCommand={this.OnFlowListContextCommand}
                            />
                        </HorizontalBox>
                        <HorizontalBox>
                            <Btn
                                Text={'新建...'}
                                OnClick={this.NewByDialog}
                                Tip={getCommandKeyDesc('New')}
                            />
                            <Btn
                                Text={'打开...'}
                                OnClick={this.OpenByDialog}
                                Tip={getCommandKeyDesc('Open')}
                            />
                            <Btn
                                Text={'保存'}
                                OnClick={this.Save}
                                Tip={getCommandKeyDesc('Save')}
                            />
                            <Btn
                                Text={'另存为...'}
                                OnClick={this.SaveByDialog}
                                Tip={getCommandKeyDesc('SaveAs')}
                            />
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
                            <Btn
                                Text={'导入对话...'}
                                OnClick={this.Import}
                                Tip={'从CSV中导入对话配置,具体请参考【流程编辑器】使用说明'}
                            />
                        </HorizontalBox>
                        {this.state.IsDevelop && this.RenderDevelopElements()}
                        <HorizontalBox>{this.RenderError()}</HorizontalBox>
                    </VerticalBox>
                </Border>
                <ScrollBox Slot={scrollBoxSlot}>
                    <ErrorBoundary>
                        {this.state.OpenError ? (
                            <SlotText Text={`${this.state.OpenError}`} />
                        ) : (
                            <FlowList FlowList={this.FlowList} OnModify={this.ModifyFlowList} />
                        )}
                    </ErrorBoundary>
                </ScrollBox>
            </VerticalBox>
        );
    }
}
