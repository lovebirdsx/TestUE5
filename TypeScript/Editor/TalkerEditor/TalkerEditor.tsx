/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { Border, HorizontalBox, MyScrollBox, VerticalBox, VerticalBoxSlot } from 'react-umg';
import { ESlateSizeRule } from 'ue';

import { log } from '../../Common/Log';
import { Btn, H1, H3 } from '../Common/BaseComponent/CommonComponent';
import { ContextBtn } from '../Common/BaseComponent/ContextBtn';
import { ErrorBoundary } from '../Common/BaseComponent/ErrorBoundary';
import { formatColor } from '../Common/Color';
import { editorConfig } from '../Common/EditorConfig';
import { getCommandKeyDesc, KeyCommands } from '../Common/KeyCommands';
import { talkerListContext } from '../Common/SchemeComponent/Context';
import {
    ITalkerInfo,
    ITalkerListInfo,
    TALKER_LIST_CSV_PATH,
    TalkerListOp,
} from '../TalkerEditor/TalkerList';
import { Talker } from './Talker';

interface ITalkerEditorState {
    TalkerList: ITalkerListInfo;
    LastTalkerList: ITalkerListInfo;
    ScrollOffset: number;
}

export class TalkerEditor extends React.Component<unknown, ITalkerEditorState> {
    private readonly CommandHandles: number[] = [];

    private ScrollOffset: number;

    private AutoSaveHander: NodeJS.Timer;

    private TimeSecond: number;

    public constructor(props: unknown) {
        super(props);
        const talkerList = TalkerListOp.Load();
        const offset = editorConfig.TalkerOffset ? editorConfig.TalkerOffset : 0;
        this.state = {
            TalkerList: talkerList,
            LastTalkerList: talkerList,
            ScrollOffset: offset,
        };
        this.ScrollOffset = offset;
        this.TimeSecond = 0;
    }

    public ComponentDidMount(): void {
        const kc = KeyCommands.GetInstance();
        this.CommandHandles.push(kc.AddCommandCallback('Save', this.Save));
    }

    public ComponentWillUnmount(): void {
        const kc = KeyCommands.GetInstance();
        this.CommandHandles.forEach((h) => {
            kc.RemoveCommandCallback(h);
        });
        this.StopAutoSave();
    }

    private readonly NeedSave = (): boolean => {
        const { TalkerList: talkerList, LastTalkerList: lastTalkerList } = this.state;
        return talkerList !== lastTalkerList;
    };

    private readonly Save = (): void => {
        TalkerListOp.Save(this.state.TalkerList);

        this.setState((state) => {
            return {
                LastTalkerList: state.TalkerList,
            };
        });
    };

    private SaveScrollOffset(): void {
        editorConfig.TalkerOffset = this.ScrollOffset;
        editorConfig.Save();
    }

    private StartAutoSave(): void {
        if (this.TimeSecond === 0) {
            const autoSaveInterval = 500;
            this.AutoSaveHander = setInterval(this.DetectAutoSave, autoSaveInterval);
        }
        this.TimeSecond = this.TimeSecond > 1000 ? 1000 : this.TimeSecond + 500;
    }

    private readonly DetectAutoSave = (): void => {
        const autoSaveInterval = 500;
        this.TimeSecond = this.TimeSecond - autoSaveInterval;
        if (this.TimeSecond > 0) {
            return;
        }
        this.SaveScrollOffset();
        this.TimeSecond = 0;
    };

    private StopAutoSave(): void {
        clearInterval(this.AutoSaveHander);
    }

    private Modify(cb: (from: ITalkerListInfo, to: ITalkerListInfo) => void): void {
        this.setState((state) => {
            const newState = produce(state, (draft) => {
                cb(state.TalkerList, draft.TalkerList);
                draft.ScrollOffset = this.ScrollOffset;
            });
            return newState;
        });
    }

    private readonly ModifyTalker = (id: number, talker: ITalkerInfo): void => {
        this.Modify((from, to) => {
            to.Talkers[id] = talker;
        });
    };

    private readonly AddTalker = (): void => {
        this.ScrollOffset = this.state.ScrollOffset < 0 ? this.state.ScrollOffset - 1 : -1;
        this.InsertTalker(this.state.TalkerList.Talkers.length);
    };

    private readonly OnUserScrolled = (currentOffset: number): void => {
        this.ScrollOffset = currentOffset;
        this.StartAutoSave();
    };

    private InsertTalker(id: number): void {
        this.Modify((from, to) => {
            const talkerId = from.TalkerGenId;
            const talker: ITalkerInfo = {
                Id: talkerId,
                Name: `说话人${talkerId}`,
                CameraBindTag: '',
            };
            to.Talkers.splice(id, 0, talker);
            to.TalkerGenId = talkerId + 1;
        });
    }

    private RemoveTalker(id: number): void {
        this.Modify((from, to) => {
            to.Talkers.splice(id, 1);
        });
    }

    private MoveTalker(id: number, isUp: boolean): void {
        this.Modify((from, to) => {
            const toTalkers = to.Talkers;
            const fromTalkers = from.Talkers;
            if (isUp) {
                if (id > 0) {
                    toTalkers[id - 1] = fromTalkers[id];
                    toTalkers[id] = fromTalkers[id - 1];
                } else {
                    log(`can not move talker ${fromTalkers[id].Name} up`);
                }
            } else {
                if (id < fromTalkers.length - 1) {
                    toTalkers[id + 1] = fromTalkers[id];
                    toTalkers[id] = fromTalkers[id + 1];
                } else {
                    log(`can not move talker ${fromTalkers[id].Name} down`);
                }
            }
        });
    }

    private OnTalkerCommand(cmd: string, id: number): void {
        switch (cmd) {
            case 'insert':
                this.InsertTalker(id);
                break;
            case 'remove':
                this.RemoveTalker(id);
                break;
            case 'moveUp':
                this.MoveTalker(id, true);
                break;
            case 'moveDown':
                this.MoveTalker(id, false);
                break;
            default:
                break;
        }
    }

    private GenPrefixForTalker(id: number): JSX.Element {
        return (
            <ContextBtn
                Commands={['insert', 'remove', 'moveUp', 'moveDown']}
                OnCommand={(cmd): void => {
                    this.OnTalkerCommand(cmd, id);
                }}
            />
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { TalkerList: talkerList } = this.state;
        const talkers = talkerList.Talkers.map((talker, id) => {
            return (
                <Talker
                    key={id}
                    Talker={talker}
                    OnModify={(t): void => {
                        this.ModifyTalker(id, t);
                    }}
                    PrefixElement={this.GenPrefixForTalker(id)}
                />
            );
        });

        const scrollBoxSlot: VerticalBoxSlot = {
            Size: { SizeRule: ESlateSizeRule.Fill },
            Padding: { Left: 10, Bottom: 10 },
        };

        return (
            <VerticalBox>
                <Border BrushColor={formatColor('#060606 ue back')}>
                    <VerticalBox>
                        <H1 Text="Talker Editor" />
                        <H3
                            Text={`${this.NeedSave() ? '*' : ''}${TALKER_LIST_CSV_PATH}`}
                            Tip="配置文件路径(相对于Content目录)"
                        />
                        <HorizontalBox>
                            <Btn Text="添加讲话人" OnClick={this.AddTalker} />
                            <Btn Text="保存" OnClick={this.Save} Tip={getCommandKeyDesc('Save')} />
                        </HorizontalBox>
                    </VerticalBox>
                </Border>
                <MyScrollBox
                    Slot={scrollBoxSlot}
                    ScrollOffset={this.state.ScrollOffset}
                    OnUserScrolled={this.OnUserScrolled}
                >
                    <ErrorBoundary>
                        <talkerListContext.Provider value={this.state.TalkerList}>
                            {talkers}
                        </talkerListContext.Provider>
                    </ErrorBoundary>
                </MyScrollBox>
            </VerticalBox>
        );
    }
}
