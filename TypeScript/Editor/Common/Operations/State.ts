/* eslint-disable spellcheck/spell-checker */
import { IActionInfo, IShowTalk, IStateInfo } from '../../../Game/Flow/Action';
import { scheme } from '../Scheme/Action';

class StateOp {
    public Check(state: IStateInfo, errorMessages: string[]): number {
        let errorCount = 0;
        state.Actions.forEach((action) => {
            const messages = [] as string[];
            errorCount += scheme.CheckAction(action, messages);
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
        scheme.FixAction(action);
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
                            option.Actions.forEach(actionCb);
                        });
                    }
                });
            }
        });
    }
}

export const stateOp = new StateOp();
