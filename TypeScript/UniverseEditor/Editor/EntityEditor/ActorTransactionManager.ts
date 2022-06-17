/* eslint-disable spellcheck/spell-checker */
import { Actor, Blueprint, EditorOperations, ETransactionStateEventTypeBP, Guid } from 'ue';

import { Event } from '../../Common/Misc/Util';

type TCommandType = 'addActor' | 'deleteActor' | 'moveActor';

interface ICommand {
    Type: TCommandType;
    Actor: Actor;
}

interface ITransactionRecord {
    Guid: string;
    Title: string;
    Commands: ICommand[];
    IsApplyed: boolean;
}

export class ActorTransactionManager {
    public readonly ActorAdded = new Event<Actor>('ActorAdded');

    public readonly ActorDeleted = new Event<Actor>('ActorDeleted');

    public readonly ActorMoved = new Event<Actor>('ActorMoved');

    private readonly RecordMap: Map<string, ITransactionRecord> = new Map();

    private CurrentRecord: ITransactionRecord;

    private IsBlueprintCompiling = false;

    public constructor() {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnActorAdded.Add(this.OnActorAdded.bind(this));
        editorEvent.OnActorDeleted.Add(this.OnActorDeleted.bind(this));
        editorEvent.OnActorMoved.Add(this.OnActorMoved.bind(this));
        editorEvent.OnBlueprintPreCompile.Add(this.OnBlueprintPreCompile.bind(this));
        editorEvent.OnBlueprintCompiled.Add(this.OnBlueprintCompiled.bind(this));
        editorEvent.OnTransactionStateChanged.Add(this.OnTransactionStateChanged.bind(this));

        editorEvent.OnPostSaveWorld.Add(this.OnPostSaveWorld.bind(this));
        editorEvent.OnPreSaveExternalActors.Add(this.OnPreSaveExternalActors.bind(this));
    }

    private OnPostSaveWorld(): void {
        // UE在Save之后, 就清理了redo 和 undo的序列
        this.RecordMap.clear();
    }

    private OnPreSaveExternalActors(): void {
        // UE在Save之后, 就清理了redo 和 undo的序列
        this.RecordMap.clear();
    }

    private OnActorAdded(actor: Actor): void {
        if (this.IsBlueprintCompiling) {
            return;
        }

        if (!this.CurrentRecord) {
            return;
        }

        this.CurrentRecord.Commands.push({
            Type: 'addActor',
            Actor: actor,
        });

        this.ActorAdded.Invoke(actor);
    }

    private OnActorDeleted(actor: Actor): void {
        if (this.IsBlueprintCompiling) {
            return;
        }

        if (!this.CurrentRecord) {
            return;
        }

        this.CurrentRecord.Commands.push({
            Type: 'deleteActor',
            Actor: actor,
        });

        this.ActorDeleted.Invoke(actor);
    }

    private OnActorMoved(actor: Actor): void {
        if (!this.CurrentRecord) {
            return;
        }

        this.CurrentRecord.Commands.push({
            Type: 'moveActor',
            Actor: actor,
        });

        this.ActorMoved.Invoke(actor);
    }

    private OnBlueprintPreCompile(bp: Blueprint): void {
        this.IsBlueprintCompiling = true;
    }

    private OnBlueprintCompiled(): void {
        this.IsBlueprintCompiling = false;
    }

    private OnUndoRedo(guid: string, isStarted: boolean): void {
        if (this.RecordMap.has(guid)) {
            const record = this.RecordMap.get(guid);
            record.Commands.forEach((cmd) => {
                switch (cmd.Type) {
                    case 'addActor':
                        if (record.IsApplyed) {
                            if (isStarted) {
                                this.ActorDeleted.Invoke(cmd.Actor);
                            }
                        } else {
                            if (!isStarted) {
                                this.ActorAdded.Invoke(cmd.Actor);
                            }
                        }
                        break;

                    case 'deleteActor':
                        if (record.IsApplyed) {
                            if (!isStarted) {
                                this.ActorAdded.Invoke(cmd.Actor);
                            }
                        } else {
                            if (isStarted) {
                                this.ActorDeleted.Invoke(cmd.Actor);
                            }
                        }
                        break;

                    case 'moveActor':
                        if (!isStarted) {
                            this.ActorMoved.Invoke(cmd.Actor);
                        }
                        break;

                    default:
                        break;
                }
            });

            // 由于每次Undo或Redo都会回调两次(UndoRedoStarted, UndoRedoFinalized)
            // 所以只在结束的时候改变transaction的执行状态
            if (!isStarted) {
                record.IsApplyed = !record.IsApplyed;
            }
        }
    }

    private GenOkCommands(commands: ICommand[]): ICommand[] {
        // 如果在同一个transaction中同时存在对同一个Actor进行Move和Add/Delelete操作, 则忽略Move
        // 否则回调时会造成访问不存在的Actor
        const okCommands: ICommand[] = [];
        commands.forEach((cmd) => {
            if (
                cmd.Type === 'moveActor' &&
                commands.find((cmd0) => cmd0.Type !== 'moveActor' && cmd0.Actor === cmd.Actor)
            ) {
                return;
            }

            okCommands.push(cmd);
        });

        return okCommands;
    }

    private OnTransactionStateChanged(
        title: string,
        guid: Guid,
        eventType: ETransactionStateEventTypeBP,
    ): void {
        switch (eventType) {
            case ETransactionStateEventTypeBP.TransactionStarted:
                this.CurrentRecord = {
                    Title: title,
                    Guid: guid.ToString(),
                    Commands: [],
                    IsApplyed: true,
                };
                break;
            case ETransactionStateEventTypeBP.TransactionFinalized:
                if (this.CurrentRecord.Commands.length > 0) {
                    this.CurrentRecord.Commands = this.GenOkCommands(this.CurrentRecord.Commands);
                    this.RecordMap.set(this.CurrentRecord.Guid, this.CurrentRecord);
                    this.CurrentRecord = undefined;
                }
                break;
            case ETransactionStateEventTypeBP.UndoRedoStarted: {
                this.OnUndoRedo(guid.ToString(), true);
                break;
            }
            case ETransactionStateEventTypeBP.UndoRedoFinalized:
                this.OnUndoRedo(guid.ToString(), false);
                break;
            default:
                break;
        }
    }
}

export const actorTransactionManager = new ActorTransactionManager();
