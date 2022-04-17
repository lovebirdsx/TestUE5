/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import {
    IAbstractType,
    IAnyProps,
    TArrayType,
    TModifyType,
    TObjectType,
} from '../../../../Common/Type';
import { actionRegistry } from '../../Scheme/Action/Index';
import { Btn, Fold, SlotText, TAB_OFFSET, Text } from '../CommonComponent';
import { ContextBtn } from '../ContextBtn';
import { Any } from './Any';

function getFoldFieldName(key: string): string {
    return `_${key}Folded`;
}

const FOLD_KEY = '_folded';

export class Obj extends React.Component<IAnyProps> {
    private ModifyKv(
        key: string,
        value: unknown,
        type: TModifyType,
        needUpdateFolded?: boolean,
    ): void {
        const newObj = produce(this.props.Value as Record<string, unknown>, (draft) => {
            if (value === undefined) {
                delete draft[key];
            } else {
                draft[key] = value;
            }
            if (needUpdateFolded) {
                draft[FOLD_KEY] = false;
            }
        });
        this.props.OnModify(newObj, type);
    }

    private readonly OnFoldChange = (isFolded: boolean): void => {
        const { Value: value } = this.props;
        const newValue = produce(value as Record<string, unknown>, (draft) => {
            draft[FOLD_KEY] = isFolded;
        });
        this.props.OnModify(newValue, 'fold');
    };

    private OnArrayFieldFoldChange(key: string, isFolded: boolean): void {
        this.ModifyKv(getFoldFieldName(key), isFolded, 'fold');
    }

    private AddArrayItem(
        arrayKey: string,
        arrayValue: unknown[],
        arrayTypeData: TArrayType<unknown>,
    ): void {
        const newArrayItem = arrayTypeData.Element.CreateDefault(arrayValue);
        const newArrayValue = produce(arrayValue, (draft) => {
            draft.push(newArrayItem);
        });
        this.ModifyKv(arrayKey, newArrayValue, 'normal');
    }

    private readonly OnToggleFiledOptional = (key: string): void => {
        const { Value: value, Type: type } = this.props;
        const fieldValue = (value as Record<string, unknown>)[key];
        if (fieldValue !== undefined) {
            this.ModifyKv(key, undefined, 'normal', true);
        } else {
            const objectTypeData = type as TObjectType<object>;
            const fieldTypeData = (objectTypeData.Fields as Record<string, unknown>)[
                key
            ] as IAbstractType<unknown>;
            this.ModifyKv(key, fieldTypeData.CreateDefault(value), 'normal', true);
        }
    };

    private RenderFieldValue(
        fieldKey: string,
        fieldValue: unknown,
        fieldTypeData: IAbstractType<unknown>,
    ): JSX.Element {
        if (fieldTypeData.RrenderType === 'array') {
            const fieldFoldKey = getFoldFieldName(fieldKey);
            const { Value: value } = this.props;
            const isFolded =
                typeof value === 'object'
                    ? ((value as Record<string, unknown>)[fieldFoldKey] as boolean)
                    : false;
            return (
                <Any
                    PrefixElement={<SlotText Text={fieldKey} />}
                    Value={fieldValue}
                    Type={fieldTypeData}
                    IsFolded={isFolded}
                    OnFoldChange={(folded): void => {
                        this.OnArrayFieldFoldChange(fieldKey, folded);
                    }}
                    OnModify={(v, type): void => {
                        this.ModifyKv(fieldKey, v, type);
                    }}
                />
            );
        }

        return (
            <Any
                Value={fieldValue}
                Type={fieldTypeData}
                OnModify={(obj: unknown, type: TModifyType): void => {
                    this.ModifyKv(fieldKey, obj, type);
                }}
            />
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { Value: value, Type: type, PrefixElement: prefixElement } = this.props;
        if (!value) {
            return <Text Text={'value is null'} Color="#FF0000 red"></Text>;
        }

        const objectType = type as TObjectType<unknown>;
        const objValue = value as Record<string, unknown>;

        // 根据obj中的字段filed来自动计算如何渲染
        // 先集中绘制不需要换行的字段
        // 再依次绘制需要换行的字段
        const sameLineFields: IAbstractType<unknown>[] = [];
        const sameLineFieldsKey: string[] = [];
        const simplifyArrayFields: IAbstractType<unknown>[] = [];
        const simplifyArrayFieldsKey: string[] = [];
        const newLineFields: IAbstractType<unknown>[] = [];
        const newLineFieldsKey: string[] = [];
        const optinalKeys: string[] = [];
        for (const key in objectType.Fields) {
            const fieldTypeData = (objectType.Fields as Record<string, unknown>)[
                key
            ] as IAbstractType<unknown>;
            if (fieldTypeData.Meta.Hide) {
                continue;
            }

            if (actionRegistry.IsFolderAble(fieldTypeData)) {
                newLineFields.push(fieldTypeData);
                newLineFieldsKey.push(key);
                if (
                    fieldTypeData.RrenderType === 'array' &&
                    fieldTypeData.Meta.ArraySimplify &&
                    objValue[key]
                ) {
                    simplifyArrayFields.push(fieldTypeData);
                    simplifyArrayFieldsKey.push(key);
                }
            } else {
                sameLineFields.push(fieldTypeData);
                sameLineFieldsKey.push(key);
            }

            if (fieldTypeData.Meta.Optional) {
                optinalKeys.push(key);
            }
        }

        const sameLine = sameLineFields.map((e, id) => {
            const fieldKey = sameLineFieldsKey[id];
            const fieldValue = objValue[fieldKey];
            const fieldTypeData = (objectType.Fields as Record<string, unknown>)[
                fieldKey
            ] as IAbstractType<unknown>;
            if (fieldTypeData.Meta.Optional && fieldValue === undefined) {
                return undefined;
            }
            return (
                <HorizontalBox key={fieldKey}>
                    {!fieldTypeData.Meta.HideName && (
                        <Text Text={`${fieldKey}:`} Tip={fieldTypeData.Meta.Tip || fieldKey} />
                    )}
                    {this.RenderFieldValue(fieldKey, fieldValue, fieldTypeData)}
                </HorizontalBox>
            );
        });

        const simplifyArray = simplifyArrayFields.map((e, id) => {
            // 显示数组类型的名字和+号
            const arrayFieldKey = simplifyArrayFieldsKey[id];
            const arrayFieldValue = objValue[arrayFieldKey];
            const arrayTypeData = (objectType.Fields as Record<string, unknown>)[
                arrayFieldKey
            ] as IAbstractType<unknown>;
            return (
                <HorizontalBox key={arrayFieldKey}>
                    <SlotText Text={arrayFieldKey} Tip={arrayTypeData.Meta.Tip || arrayFieldKey} />
                    <Btn
                        Text={'✚'}
                        Tip={'添加'}
                        OnClick={(): void => {
                            this.AddArrayItem(
                                arrayFieldKey,
                                arrayFieldValue as unknown[],
                                arrayTypeData as TArrayType<unknown>,
                            );
                        }}
                    />
                </HorizontalBox>
            );
        });

        // eslint-disable-next-line no-undef
        const newLine: JSX.Element[] = [];
        newLineFields.forEach((e, id) => {
            const fieldKey = newLineFieldsKey[id];
            const fieldValue = objValue[fieldKey];
            const fieldTypeData = (objectType.Fields as Record<string, unknown>)[
                fieldKey
            ] as IAbstractType<unknown>;
            if (fieldValue !== undefined) {
                newLine.push(
                    <HorizontalBox key={id}>
                        {!fieldTypeData.Meta.HideName && (
                            <Text Text={`${fieldKey}:`} Tip={fieldTypeData.Meta.Tip || fieldKey} />
                        )}
                        {this.RenderFieldValue(fieldKey, fieldValue, fieldTypeData)}
                    </HorizontalBox>,
                );
            }
        });

        const isFold = objValue[FOLD_KEY] as boolean;
        return (
            <VerticalBox>
                <HorizontalBox>
                    {newLineFields.length > 0 && (
                        <Fold
                            IsFold={isFold}
                            IsFull={newLine.length > 0}
                            OnChanged={this.OnFoldChange}
                        />
                    )}
                    {prefixElement}
                    <HorizontalBox>{sameLine}</HorizontalBox>
                    <HorizontalBox>{simplifyArray}</HorizontalBox>
                    {optinalKeys.length > 0 && <SlotText Text="Op" Tip="可选参数" />}
                    {optinalKeys.length > 0 && (
                        <ContextBtn
                            Commands={optinalKeys}
                            OnCommand={this.OnToggleFiledOptional}
                            Tip="切换可选参数"
                        />
                    )}
                </HorizontalBox>
                <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                    {!isFold && newLine}
                </VerticalBox>
            </VerticalBox>
        );
    }
}
