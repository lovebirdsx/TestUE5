/* eslint-disable spellcheck/spell-checker */
import { UMGRoot } from 'ue';

import { error } from '../../Common/Misc/Log';

const allCommands = [
    'New',
    'Save',
    'Redo',
    'Undo',
    'Open',
    'SaveAs',
    'ClearConsole',
    'ToggleDevelop',
] as const;
export type TCommand = typeof allCommands[number];

const allKeys = [
    'MouseX',
    'MouseY',
    'Mouse2D',
    'MouseScrollUp',
    'MouseScrollDown',
    'MouseWheelAxis',
    'LeftMouseButton',
    'RightMouseButton',
    'MiddleMouseButton',
    'ThumbMouseButton',
    'ThumbMouseButton2',
    'BackSpace',
    'Tab',
    'Enter',
    'Pause',
    'CapsLock',
    'Escape',
    'SpaceBar',
    'PageUp',
    'PageDown',
    'End',
    'Home',
    'Left',
    'Up',
    'Right',
    'Down',
    'Insert',
    'Delete',
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'NumPadZero',
    'NumPadOne',
    'NumPadTwo',
    'NumPadThree',
    'NumPadFour',
    'NumPadFive',
    'NumPadSix',
    'NumPadSeven',
    'NumPadEight',
    'NumPadNine',
    'Multiply',
    'Add',
    'Subtract',
    'Decimal',
    'Divide',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'NumLock',
    'ScrollLock',
    'LeftShift',
    'RightShift',
    'LeftControl',
    'RightControl',
    'LeftAlt',
    'RightAlt',
    'LeftCommand',
    'RightCommand',
] as const;
type TKey = typeof allKeys[number];

const commandMap: { [key in TCommand]: TKey[] } = {
    Open: ['LeftControl', 'O'],
    New: ['LeftControl', 'N'],
    SaveAs: ['LeftControl', 'LeftShift', 'S'],
    Save: ['LeftControl', 'S'],
    Redo: ['LeftControl', 'LeftShift', 'Z'],
    Undo: ['LeftControl', 'Z'],
    ClearConsole: ['F2'],
    ToggleDevelop: ['F12'],
};

interface ICallbackRecord {
    Callback: () => void;
    Handle: number;
    Command: TCommand;
}

export class KeyCommands {
    private static Instance: KeyCommands;

    public static GetInstance(): KeyCommands {
        if (!this.Instance) {
            throw new Error('Must create KeyCommands before get instance');
        }
        return this.Instance;
    }

    public static Init(umgRoot: UMGRoot): void {
        this.Instance = new KeyCommands(umgRoot);
    }

    private readonly KeyDownRecords = new Set<string>();

    private readonly CallbackMap = new Map<TCommand, ICallbackRecord[]>();

    private readonly CallbackRecords: ICallbackRecord[] = [];

    private MaxHandle = 0;

    private constructor(umgRoot: UMGRoot) {
        umgRoot.OnUMGKeyDown.Add(this.OnKeyDown);
        umgRoot.OnUMGKeyUp.Add(this.OnKeyUp);
        umgRoot.OnUMGTick.Add(this.OnTick);
        umgRoot.OnUMGFocusLost.Add(this.OnFocusLost);
        umgRoot.OnUMGFocusGet.Add(this.OnFocusGet);
        allCommands.forEach((command) => {
            this.CallbackMap.set(command, []);
        });
    }

    private readonly OnFocusGet = (): void => {};

    private readonly OnFocusLost = (): void => {
        this.KeyDownRecords.clear();
    };

    private readonly OnTick = (deltaTime: number): void => {};

    private readonly OnKeyUp = (key: string): void => {
        this.KeyDownRecords.delete(key);
    };

    private readonly OnKeyDown = (key: string): void => {
        this.KeyDownRecords.add(key);
        this.TryInvokeCommand();
    };

    private TryInvokeCommand(): void {
        let bestCommand: TCommand = undefined;
        let bestCommandKeysCount = 0;
        allCommands.forEach((command) => {
            const keys = commandMap[command];
            if (!keys.find((key) => !this.KeyDownRecords.has(key))) {
                if (!bestCommand || keys.length > bestCommandKeysCount) {
                    bestCommand = command;
                    bestCommandKeysCount = keys.length;
                }
            }
        });

        if (bestCommand) {
            const callbacksToInvocke: ICallbackRecord[] = [...this.CallbackMap.get(bestCommand)];
            callbacksToInvocke.forEach((e) => {
                e.Callback();
            });
        }
    }

    public AddCommandCallback(command: TCommand, callback: () => void): number {
        const callbacks = this.CallbackMap.get(command);
        const record: ICallbackRecord = {
            Callback: callback,
            Handle: ++this.MaxHandle,
            Command: command,
        };
        callbacks.push(record);
        this.CallbackRecords.push(record);
        return record.Handle;
    }

    public RemoveCommandCallback(handler: number): void {
        const id = this.CallbackRecords.findIndex((e) => e.Handle === handler);
        if (id < 0) {
            error(`remove no exist callback, handle = ${handler}`);
            return;
        }

        const record = this.CallbackRecords[id];
        this.CallbackRecords.splice(id, 1);
        const callbacks = this.CallbackMap.get(record.Command);
        callbacks.splice(
            callbacks.findIndex((e) => e.Handle === record.Handle),
            1,
        );
    }
}

export function getCommandKeyDesc(command: TCommand): string {
    const keys = commandMap[command];
    return keys.join(' + ');
}
