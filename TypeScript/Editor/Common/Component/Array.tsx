/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { log } from '../Log';
import { IAnyProps, TArrayType } from '../Scheme';
import { Any } from './Any';
import { Btn, Fold, TAB_OFFSET } from './CommonComponent';
import { ContextBtn } from './ContextBtn';

export class Array extends React.Component<IAnyProps> {
    public ModifyByCb(cb: (from: unknown[], to: unknown[]) => void): void {
        const from = this.props.Value as unknown[];
        const newValue = produce(from, (draft) => {
            cb(from, draft);
        });
        this.props.OnModify(newValue);
    }

    private SpawnElementAfter(array: unknown[], id: number): unknown {
        const arrayType = this.props.Type as TArrayType<unknown>;
        const result = arrayType.Element.CreateDefault(array);
        return result;
    }

    private Modify(id: number, e: unknown): void {
        this.ModifyByCb((from, to) => {
            to[id] = e;
        });
    }

    private readonly Add = (): void => {
        this.ModifyByCb((from, to) => {
            const e = this.SpawnElementAfter(from, from.length - 1);
            to.push(e);
        });
        this.props.OnFoldChange(false);
    };

    private readonly Insert = (id: number): void => {
        this.ModifyByCb((from, to) => {
            const e = this.SpawnElementAfter(from, id);
            to.splice(id, 0, e);
        });
    };

    private readonly Remove = (id: number): void => {
        this.ModifyByCb((form, to) => {
            to.splice(id, 1);
        });
    };

    private readonly Move = (id: number, isUp: boolean): void => {
        this.ModifyByCb((from, to) => {
            if (isUp) {
                if (id > 0) {
                    to[id] = from[id - 1];
                    to[id - 1] = from[id];
                } else {
                    log('Can not move up');
                }
            } else {
                if (id < from.length - 1) {
                    to[id] = from[id + 1];
                    to[id + 1] = from[id];
                } else {
                    log('Can not move down');
                }
            }
        });
    };

    private OnElementContextCommand(id: number, cmd: string): void {
        switch (cmd) {
            case 'insert':
                this.Insert(id);
                break;
            case 'remove':
                this.Remove(id);
                break;
            case 'moveUp':
                this.Move(id, true);
                break;
            case 'moveDown':
                this.Move(id, false);
                break;
            default:
                break;
        }
    }

    private GetArrayItemTip(): string {
        const arrayType = this.props.Type as TArrayType<unknown>;
        return arrayType.Element.Meta.Tip || '数组项';
    }

    private CreatePrefixElement(id: number): JSX.Element {
        return (
            <HorizontalBox>
                {/* <SlotText text={`[${id}]`}/> */}
                <ContextBtn
                    Commands={['insert', 'remove', 'moveUp', 'moveDown']}
                    OnCommand={(cmd): void => {
                        this.OnElementContextCommand(id, cmd);
                    }}
                    Tip={`针对当前${this.GetArrayItemTip()}操作`}
                />
            </HorizontalBox>
        );
    }

    private CreateItemsElement(): JSX.Element[] {
        const { Value: value, Type: type } = this.props;
        const arrayType = type as TArrayType<unknown>;
        const arrayValue = value as unknown[];
        return arrayValue.map((e, id) => {
            return (
                <Any
                    key={id}
                    PrefixElement={this.CreatePrefixElement(id)}
                    Value={e}
                    Type={arrayType.Element}
                    OnModify={(e0): void => {
                        this.Modify(id, e0);
                    }}
                />
            );
        });
    }

    private RenderOneLineArray(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn Text={'✚'} OnClick={this.Add} Tip={`增加${this.GetArrayItemTip()}`} />
                {this.CreateItemsElement()}
            </HorizontalBox>
        );
    }

    private RenderMutilineArray(): JSX.Element {
        const {
            Value: value,
            Type: type,
            IsFolded: isFolded,
            PrefixElement: prefixElement,
        } = this.props;

        if (type.Meta.ArraySimplify) {
            return <VerticalBox>{!isFolded && this.CreateItemsElement()}</VerticalBox>;
        }
        return (
            <VerticalBox>
                <HorizontalBox>
                    <Fold
                        IsFold={isFolded}
                        OnChanged={this.props.OnFoldChange}
                        IsFull={(value as unknown[]).length > 0}
                    />
                    {prefixElement}
                    {<Btn Text={'✚'} OnClick={this.Add} />}
                </HorizontalBox>
                <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                    {!isFolded && this.CreateItemsElement()}
                </VerticalBox>
            </VerticalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { Type: type } = this.props;
        if (type.Meta.NewLine) {
            return this.RenderMutilineArray();
        }

        return this.RenderOneLineArray();
    }
}
