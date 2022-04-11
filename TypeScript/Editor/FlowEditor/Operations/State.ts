/* eslint-disable spellcheck/spell-checker */
import { IActionInfo, IShowTalk, IStateInfo } from '../../../Game/Flow/Action';
import { scheme } from '../../Common/Scheme/Action';

export class StateOp {
    public static Fix(state: IStateInfo, versionFrom: number, versionTo: number): void {
        state.Actions.forEach((action) => {
            this.FixAction(action, versionFrom, versionTo);
        });
    }

    public static FixAction(action: IActionInfo, versionFrom: number, versionTo: number): void {
        scheme.FixAction(action);
    }

    public static ForeachActions(state: IStateInfo, actionCb: (action: IActionInfo) => void): void {
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
