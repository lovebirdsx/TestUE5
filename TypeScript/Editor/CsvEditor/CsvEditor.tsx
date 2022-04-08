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

import { formatColor } from '../Common/Component/Color';
import {
    Btn,
    DEFAULT_TEXT_COLOR,
    HEADING_COLOR,
    SlotText,
    Text,
} from '../Common/Component/CommonComponent';
import { CsvView } from '../Common/Component/CsvView';
import { ICsv } from '../Common/CsvLoader';
import { getCommandKeyDesc, KeyCommands } from '../Common/KeyCommands';
import { log } from '../Common/Log';
import { openDirOfFile } from '../Common/Util';
import { ConfigFile } from '../FlowEditor/ConfigFile';
import { csvRegistry } from './CsvRegistry';

interface ICsvState {
    Name: string;
    Csv: ICsv;
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
    private readonly ConfigFile: ConfigFile;

    private readonly CommandHandles: number[] = [];

    private AutoSaveHander: NodeJS.Timer;

    private LastModifyTime: number;

    private TimeSecond: number;

    public constructor(props: unknown) {
        super(props);

        this.ConfigFile = new ConfigFile();
        this.ConfigFile.Load();

        this.state = this.LoadInitState();
    }

    private LoadInitState(): ICsvEditorState {
        const name = this.ConfigFile.CsvName;
        const csvState: ICsvState = {
            Name: name,
            Csv: csvRegistry.Load(name),
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

        if (this.TimeSecond - this.LastModifyTime < ConfigFile.AutoSaveInterval) {
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

            if (draft.Histories.length > ConfigFile.MaxHistory) {
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
            },
            false,
        );
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

        const newCsvState = {
            Name: name,
            Csv: csvRegistry.Load(name),
        };
        this.RecordCsvState(newCsvState, true);

        this.ConfigFile.CsvName = name;
        this.ConfigFile.Save();
    }

    private RenderAllCsvEntries(): JSX.Element {
        const colCount = 4;
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const scrollBoxSlot: VerticalBoxSlot = {
            Size: { SizeRule: ESlateSizeRule.Fill },
        };

        return (
            <VerticalBox>
                <Border BrushColor={formatColor('#060606 ue back')}>
                    <VerticalBox>
                        {this.RenderPath()}
                        {this.RenderToolbar()}
                        {this.RenderAllCsvEntries()}
                    </VerticalBox>
                </Border>
                <ScrollBox Slot={scrollBoxSlot}>
                    <CsvView Csv={this.CurrentCsvState.Csv} OnModify={this.OnModifyCsv} />
                </ScrollBox>
            </VerticalBox>
        );
    }
}
