/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import {
    Border,
    GridPanel,
    GridSlot,
    HorizontalBox,
    ScrollBox,
    VerticalBox,
    VerticalBoxSlot,
} from 'react-umg';
import { EditorOperations, EMsgResult, EMsgType, ESlateSizeRule } from 'ue';

import { ICsv } from '../../Common/CsvConfig/CsvLoader';
import { csvRegistry, ECsvName } from '../../Common/CsvConfig/CsvRegistry';
import { log } from '../../Common/Misc/Log';
import {
    Btn,
    DEFAULT_TEXT_COLOR,
    ErrorText,
    HEADING_COLOR,
    SlotText,
    Text,
} from '../Common/BaseComponent/CommonComponent';
import { CsvView } from '../Common/BaseComponent/CsvView';
import { ErrorBoundary } from '../Common/BaseComponent/ErrorBoundary';
import { formatColor } from '../Common/Color';
import { configExporter } from '../Common/ConfigExporter';
import { editorConfig } from '../Common/EditorConfig';
import { getCommandKeyDesc, KeyCommands } from '../Common/KeyCommands';
import { editorCsvRegistry } from '../Common/Scheme/Csv/CsvRegistry';
import { openDirOfFile, openFile } from '../Common/Util';

interface ICsvState {
    Name: ECsvName;
    Csv: ICsv;
    FilterTexts: string[];
}

interface ICsvEditorState {
    LastLoadedCsvState: ICsvState;
    StepId: number;
    Histories: ICsvState[];
}

function canUndo(state: ICsvEditorState): boolean {
    return state.StepId > 0 && state.Histories.length > 0;
}

function canRedo(state: ICsvEditorState): boolean {
    return state.StepId < state.Histories.length - 1;
}

export class CsvEditor extends React.Component<unknown, ICsvEditorState> {
    private readonly CommandHandles: number[] = [];

    private AutoSaveHander: NodeJS.Timer;

    private LastModifyTime: number;

    private TimeSecond: number;

    public constructor(props: unknown) {
        super(props);
        this.state = this.LoadInitState();
    }

    private LoadInitState(): ICsvEditorState {
        const name = editorConfig.CsvName;
        const csv = csvRegistry.Load(name as ECsvName);
        const csvState: ICsvState = {
            Name: name as ECsvName,
            Csv: csv,
            FilterTexts: csv.FiledTypes.map(() => ''),
        };
        return {
            StepId: 0,
            Histories: [csvState],
            LastLoadedCsvState: csvState,
        };
    }

    private get CurrentCsvState(): ICsvState {
        const state = this.state;
        return state.Histories[state.StepId];
    }

    private StartAutoSave(): void {
        const autoSaveInterval = 1000;
        this.AutoSaveHander = setInterval(this.DetectAutoSave, autoSaveInterval);
        this.TimeSecond = 0;
    }

    private readonly DetectAutoSave = (): void => {
        this.TimeSecond++;
        if (!this.NeedSave()) {
            return;
        }

        if (this.TimeSecond - this.LastModifyTime < editorConfig.AutoSaveInterval) {
            return;
        }

        log('Auto save triggered');
        this.Save();
    };

    private RegKeyCommands(): void {
        const kc = KeyCommands.GetInstance();
        this.CommandHandles.push(kc.AddCommandCallback('Save', this.Save));
        this.CommandHandles.push(kc.AddCommandCallback('Redo', this.Redo));
        this.CommandHandles.push(kc.AddCommandCallback('Undo', this.Undo));
    }

    private RemKeyCommands(): void {
        const kc = KeyCommands.GetInstance();
        this.CommandHandles.forEach((handle) => {
            kc.RemoveCommandCallback(handle);
        });
    }

    private StopAutoSave(): void {
        clearInterval(this.AutoSaveHander);
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public UNSAFE_componentWillMount(): void {
        this.RegKeyCommands();
        this.StartAutoSave();
    }

    public ComponentWillUnmount(): void {
        this.RemKeyCommands();
        this.StopAutoSave();
    }

    private RecordCsvState(csvState: ICsvState, isSaved: boolean): void {
        const newEditorState = produce(this.state, (draft) => {
            if (draft.StepId < draft.Histories.length - 1) {
                draft.Histories.splice(draft.StepId + 1);
            }

            draft.Histories.push(csvState);
            draft.StepId++;

            if (draft.Histories.length > editorConfig.MaxHistory) {
                draft.Histories.shift();
                draft.StepId--;
            }

            if (isSaved) {
                draft.LastLoadedCsvState = csvState;
            }
        });
        this.setState(newEditorState);
        this.LastModifyTime = this.TimeSecond;
    }

    private readonly OnModifyCsv = (csv: ICsv): void => {
        this.RecordCsvState(
            {
                Name: this.CurrentCsvState.Name,
                Csv: csv,
                FilterTexts: this.CurrentCsvState.FilterTexts,
            },
            false,
        );
    };

    private readonly OnModifyFilterTexts = (id: number, text: string): void => {
        const state = this.CurrentCsvState;
        const newState = produce(state, (draft) => {
            draft.FilterTexts[id] = text;
        });
        this.RecordCsvState(newState, false);
    };

    private SaveImpl(): void {
        const state = this.CurrentCsvState;
        csvRegistry.Save(state.Name, state.Csv);
    }

    private readonly Save = (): void => {
        if (!this.NeedSave()) {
            return;
        }

        this.SaveImpl();
        this.setState({
            LastLoadedCsvState: this.CurrentCsvState,
        });
    };

    private SetStep(newStepId: number): void {
        this.setState((state) => {
            const oldCsvState = state.Histories[state.StepId];
            const newCsvState = state.Histories[newStepId];
            return {
                StepId: newStepId,
                LastLoadedCsvState:
                    oldCsvState.Name !== newCsvState.Name ? newCsvState : state.LastLoadedCsvState,
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

    private NeedSave(): boolean {
        return this.CurrentCsvState !== this.state.LastLoadedCsvState;
    }

    private readonly GetUndoStateStr = (): string => {
        const { state } = this;
        return `${state.StepId + 1} / ${state.Histories.length}`;
    };

    private RenderPath(): JSX.Element {
        const path = csvRegistry.GetPath(this.CurrentCsvState.Name);
        return (
            <HorizontalBox>
                <SlotText Text={this.NeedSave() ? '*' + path : path} />
                <Btn
                    Text={'打开'}
                    OnClick={(): void => {
                        openFile(path);
                    }}
                />
                <Btn
                    Text={'目录'}
                    OnClick={(): void => {
                        openDirOfFile(path);
                    }}
                />
            </HorizontalBox>
        );
    }

    private RenderToolbar(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn
                    Text={'保存'}
                    Disabled={!this.NeedSave()}
                    OnClick={this.Save}
                    Tip={getCommandKeyDesc('Save')}
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
                    Text={'导出'}
                    Tip={'导出所有配置, 未修改的不导出'}
                    OnClick={(): void => {
                        configExporter.ExportByUser();
                    }}
                />
                <Btn
                    Text={'重导'}
                    Tip={'强制导出所有配置, 忽略是否修改'}
                    OnClick={(): void => {
                        configExporter.ExportByUser(true);
                    }}
                />
            </HorizontalBox>
        );
    }

    private SetCsvName(name: string): void {
        const csvState = this.CurrentCsvState;
        if (csvState.Name === name) {
            return;
        }

        if (this.NeedSave()) {
            const result = EditorOperations.ShowMessage(
                EMsgType.YesNoCancel,
                `[${csvState.Name}]已经修改,需要保存吗?`,
            );
            if (result === EMsgResult.Cancel) {
                return;
            } else if (result === EMsgResult.Yes) {
                this.SaveImpl();
            }
        }

        const newCsv = csvRegistry.Load(name as ECsvName);
        const newCsvState: ICsvState = {
            Name: name as ECsvName,
            Csv: newCsv,
            FilterTexts: newCsv.FiledTypes.map(() => ''),
        };
        this.RecordCsvState(newCsvState, true);

        editorConfig.CsvName = name;
        editorConfig.Save();
    }

    private RenderAllCsvEntries(): JSX.Element {
        const colCount = 6;
        const currentName = this.CurrentCsvState.Name;
        const nameElements = csvRegistry.Names.map((name, id) => {
            const row = Math.floor(id / colCount);
            const col = id % colCount;
            const slot: GridSlot = { Row: row + 1, Column: col };
            return (
                <Btn
                    Slot={slot}
                    Text={name}
                    key={name}
                    Color={name === currentName ? HEADING_COLOR : DEFAULT_TEXT_COLOR}
                    OnClick={(): void => {
                        this.SetCsvName(name);
                    }}
                />
            );
        });
        return <GridPanel>{nameElements}</GridPanel>;
    }

    private RenderErrors(): JSX.Element {
        const state = this.CurrentCsvState;
        const messages: string[] = [];
        if (editorCsvRegistry.Check(state.Name, state.Csv, messages) > 0) {
            return (
                <VerticalBox>
                    {messages.map((msg) => (
                        <ErrorText Text={msg} />
                    ))}
                </VerticalBox>
            );
        }

        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const scrollBoxSlot: VerticalBoxSlot = {
            Size: { SizeRule: ESlateSizeRule.Fill },
        };

        return (
            <VerticalBox>
                <ErrorBoundary>
                    <Border BrushColor={formatColor('#060606 ue back')}>
                        <VerticalBox>
                            {this.RenderPath()}
                            {this.RenderToolbar()}
                            {this.RenderAllCsvEntries()}
                            {this.RenderErrors()}
                        </VerticalBox>
                    </Border>
                    <ErrorBoundary>
                        <ScrollBox Slot={scrollBoxSlot}>
                            <CsvView
                                Csv={this.CurrentCsvState.Csv}
                                Name={this.CurrentCsvState.Name}
                                FilterTexts={this.CurrentCsvState.FilterTexts}
                                OnModify={this.OnModifyCsv}
                                OnModifyFilterTexts={this.OnModifyFilterTexts}
                            />
                        </ScrollBox>
                    </ErrorBoundary>
                </ErrorBoundary>
            </VerticalBox>
        );
    }
}
