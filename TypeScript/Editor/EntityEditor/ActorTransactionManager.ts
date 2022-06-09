/* eslint-disable spellcheck/spell-checker */
import { Actor, EditorOperations, ETransactionStateEventTypeBP, Guid } from 'ue';

import { Event } from '../../Common/Util';

type TCommandType = 'addActor' | 'deleteActor';

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

    private readonly RecordMap: Map<string, ITransactionRecord> = new Map();

    private CurrentRecord: ITransactionRecord;

    public Init(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnActorAdded.Add(this.OnActorAdded);
        editorEvent.OnActorDeleted.Add(this.OnActorDeleted);
        editorEvent.OnTransactionStateChanged.Add(this.OnTransactionStateChanged);
    }

    public Exit(): void {
        const editorEvent = EditorOperations.GetEditorEvent();
        editorEvent.OnActorAdded.Remove(this.OnActorAdded);
        editorEvent.OnActorDeleted.Remove(this.OnActorDeleted);
        editorEvent.OnTransactionStateChanged.Remove(this.OnTransactionStateChanged);
    }

    private readonly OnActorAdded = (actor: Actor): void => {
        if (!this.CurrentRecord) {
            return;
        }

        this.CurrentRecord.Commands.push({
            Type: 'addActor',
            Actor: actor,
        });
    };

    private readonly OnActorDeleted = (actor: Actor): void => {
        if (!this.CurrentRecord) {
            return;
        }

        this.CurrentRecord.Commands.push({
            Type: 'deleteActor',
            Actor: actor,
        });
    };

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

    private readonly OnTransactionStateChanged = (
        title: string,
        guid: Guid,
        eventType: ETransactionStateEventTypeBP,
    ): void => {
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
    };
}
