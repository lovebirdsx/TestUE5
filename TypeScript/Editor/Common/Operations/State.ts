/* eslint-disable spellcheck/spell-checker */
import { IActionInfo, IShowTalk, IStateInfo } from '../../../Game/Flow/Action';
import { actionRegistry } from '../../../Game/Scheme/Action/Public';

class StateOp {
    public Check(state: IStateInfo, errorMessages: string[]): number {
        let errorCount = 0;
        state.Actions.forEach((action) => {
            const messages = [] as string[];
            errorCount += actionRegistry.CheckAction(action, messages);
            messages.forEach((msg) => {
                errorMessages.push(`[${state.Name}]${msg}`);
            });
        });
        return errorCount;
    }

    public Fix(state: IStateInfo, versionFrom: number, versionTo: number): void {
        state.Actions.forEach((action) => {
            this.FixAction(action, versionFrom, versionTo);
        });
    }

    public FixAction(action: IActionInfo, versionFrom: number, versionTo: number): void {
        actionRegistry.FixAction(action);
    }

    public ForeachActions(state: IStateInfo, actionCb: (action: IActionInfo) => void): void {
        state.Actions.forEach((action) => {
            actionCb(action);
            if (action.Name === 'ShowTalk') {
                const showTalk = action.Params as IShowTalk;
                showTalk.TalkItems.forEach((talkItem) => {
                    if (talkItem.Actions) {
                        talkItem.Actions.forEach(actionCb);
                    }
                    if (talkItem.Options) {
                        talkItem.Options.forEach((option) => {
                            if (option.Actions) {
                                option.Actions.forEach(actionCb);
                            }
                        });
                    }
                });
            }
        });
    }
}

export const stateOp = new StateOp();
