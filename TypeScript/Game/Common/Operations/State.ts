/* eslint-disable spellcheck/spell-checker */
import { TFixResult } from '../../../Common/Type';
import { IActionInfo, IShowTalk, IStateInfo } from '../../Interface/Action';
import { actionRegistry } from '../../Scheme/Action/Public';

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

    public Fix(state: IStateInfo): TFixResult {
        let result: TFixResult = 'nothing';
        state.Actions.forEach((action) => {
            if (this.FixAction(action) === 'fixed') {
                result = 'fixed';
            }
        });
        return result;
    }

    public FixAction(action: IActionInfo): TFixResult {
        return actionRegistry.FixAction(action);
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
