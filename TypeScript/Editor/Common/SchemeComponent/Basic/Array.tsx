/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { globalContexts } from '../../../../Common/GlobalContext';
import { log } from '../../../../Common/Log';
import { ArrayScheme, IProps, TModifyType } from '../../../../Common/Type';
import { Btn, Fold, TAB_OFFSET } from '../../BaseComponent/CommonComponent';
import { ContextBtn } from '../../BaseComponent/ContextBtn';
import { copyObject, pasteObject } from '../../Util';
import { arrayContext } from '../Context';
import { Any } from './Any';

export class Array extends React.Component<IProps<unknown[], ArrayScheme>> {
    public ModifyByCb(
        cb: (from: unknown[], to: unknown[]) => void,
        type: TModifyType = 'normal',
    ): void {
        const from = this.props.Value;
        const newValue = produce(from, (draft) => {
            cb(from, draft);
        });
        this.props.OnModify(newValue, type);
    }

    private SpawnElement(): unknown {
        const scheme = this.props.Scheme;
        const handle = globalContexts.Push(scheme, this.props.Value);
        const result = scheme.Element.CreateDefault();
        globalContexts.Pop(handle);
        return result;
    }

    private Modify(id: number, e: unknown, type: TModifyType): void {
        this.ModifyByCb((from, to) => {
            to[id] = e;
        }, type);
    }

    private readonly Add = (): void => {
        this.ModifyByCb((from, to) => {
            const e = this.SpawnElement();
            to.push(e);
        });
        this.props.OnFoldChange(false);
    };

    private readonly Insert = (id: number): void => {
        this.ModifyByCb((from, to) => {
            const e = this.SpawnElement();
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
            case '拷贝':
                copyObject(this.props.Scheme.Name, this.props.Value[id]);
                break;
            case '粘贴': {
                const value = pasteObject(this.props.Scheme.Name);
                if (value) {
                    this.Modify(id, value, 'normal');
                }
                break;
            }
            case '上插':
                this.Insert(id);
                break;
            case '下插':
                this.Insert(id + 1);
                break;
            case '移除':
                this.Remove(id);
                break;
            case '上移':
                this.Move(id, true);
                break;
            case '下移':
                this.Move(id, false);
                break;
            default:
                break;
        }
    }

    private GetArrayItemTip(): string {
        return this.props.Scheme.Element.Tip || '数组项';
    }

    private CreatePrefixElement(id: number): JSX.Element {
        return (
            <HorizontalBox>
                <ContextBtn
                    Commands={['拷贝', '粘贴', '上插', '下插', '移除', '上移', '下移']}
                    OnCommand={(cmd): void => {
                        this.OnElementContextCommand(id, cmd);
                    }}
                    Tip={`针对当前${this.GetArrayItemTip()}操作`}
                />
            </HorizontalBox>
        );
    }

    private CreateItemsElement(): JSX.Element[] {
        const { Value: value, Scheme: scheme } = this.props;
        return value.map((e, id) => {
            return (
                <Any
                    key={id}
                    PrefixElement={this.CreatePrefixElement(id)}
                    Value={e}
                    Scheme={scheme.Element}
                    OnModify={(e0, type): void => {
                        this.Modify(id, e0, type);
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
            Scheme: type,
            IsFolded: isFolded,
            PrefixElement: prefixElement,
        } = this.props;

        if (type.ArraySimplify) {
            return <VerticalBox>{!isFolded && this.CreateItemsElement()}</VerticalBox>;
        }
        return (
            <VerticalBox>
                <HorizontalBox>
                    <Fold
                        IsFold={isFolded}
                        OnChanged={this.props.OnFoldChange}
                        IsFull={value.length > 0}
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
        const scheme = this.props.Scheme;
        return (
            <arrayContext.Provider value={{ Array: this.props.Value, Scheme: scheme }}>
                {scheme.NewLine ? this.RenderMutilineArray() : this.RenderOneLineArray()}
            </arrayContext.Provider>
        );
    }
}
