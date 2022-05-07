/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { globalContexts } from '../../../../Common/GlobalContext';
import { ArrayScheme, IProps, ObjectScheme, Scheme, TModifyType } from '../../../../Common/Type';
import { Btn, Fold, SlotText, TAB_OFFSET, Text } from '../../BaseComponent/CommonComponent';
import { ContextBtn } from '../../BaseComponent/ContextBtn';
import { Any } from './Any';

function getFoldFieldName(key: string): string {
    return `_${key}Folded`;
}

const FOLD_KEY = '_folded';

export class Obj<T, TScheme extends ObjectScheme<T>> extends React.Component<IProps<T, TScheme>> {
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
        arrayTypeData: ArrayScheme,
    ): void {
        const objHandle = globalContexts.Push(this.props.Scheme, this.props.Value);
        const arrayHandle = globalContexts.Push(arrayTypeData, arrayValue);
        const newArrayItem = arrayTypeData.Element.CreateDefault();
        globalContexts.Pop(arrayHandle);
        globalContexts.Pop(objHandle);
        const newArrayValue = produce(arrayValue, (draft) => {
            draft.push(newArrayItem);
        });
        this.ModifyKv(arrayKey, newArrayValue, 'normal');
    }

    private readonly OnToggleFiledOptional = (key: string): void => {
        const { Value: value, Scheme: type } = this.props;
        const fieldValue = (value as Record<string, unknown>)[key];
        if (fieldValue !== undefined) {
            this.ModifyKv(key, undefined, 'normal', true);
        } else {
            const fieldTypeData = (type.Fields as Record<string, unknown>)[key] as Scheme;
            this.ModifyKv(key, fieldTypeData.CreateDefault(), 'normal', true);
        }
    };

    private RenderFieldValue(
        fieldKey: string,
        fieldValue: unknown,
        fieldTypeData: Scheme,
    ): JSX.Element {
        if (fieldTypeData.RenderType === 'array') {
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
                    Owner={value}
                    Scheme={fieldTypeData}
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
                Owner={this.props.Value}
                Scheme={fieldTypeData}
                OnModify={(obj: unknown, type: TModifyType): void => {
                    this.ModifyKv(fieldKey, obj, type);
                }}
            />
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const { Value: value, Scheme: type, PrefixElement: prefixElement } = this.props;
        if (!value) {
            return <Text Text={'value is null'} Color="#FF0000 red"></Text>;
        }

        const objectType = type as ObjectScheme<unknown>;
        const objValue = value as Record<string, unknown>;

        // 根据obj中的字段filed来自动计算如何渲染
        // 先集中绘制不需要换行的字段
        // 再依次绘制需要换行的字段
        const sameLineFields: Scheme[] = [];
        const sameLineFieldsKey: string[] = [];
        const simplifyArrayFields: Scheme[] = [];
        const simplifyArrayFieldsKey: string[] = [];
        const newLineFields: Scheme[] = [];
        const newLineFieldsKey: string[] = [];
        const optinalKeys: string[] = [];
        for (const key in objectType.Fields) {
            const fieldTypeData = (objectType.Fields as Record<string, unknown>)[key] as Scheme;
            if (fieldTypeData.Hide) {
                continue;
            }

            if (fieldTypeData.NewLine) {
                newLineFields.push(fieldTypeData);
                newLineFieldsKey.push(key);
                if (
                    fieldTypeData.RenderType === 'array' &&
                    fieldTypeData.ArraySimplify &&
                    objValue[key]
                ) {
                    simplifyArrayFields.push(fieldTypeData);
                    simplifyArrayFieldsKey.push(key);
                }
            } else {
                sameLineFields.push(fieldTypeData);
                sameLineFieldsKey.push(key);
            }

            if (fieldTypeData.Optional) {
                optinalKeys.push(key);
            }
        }

        const sameLine = sameLineFields.map((e, id) => {
            const fieldKey = sameLineFieldsKey[id];
            const fieldValue = objValue[fieldKey];
            const fieldTypeData = (objectType.Fields as Record<string, unknown>)[
                fieldKey
            ] as Scheme;
            if (fieldTypeData.Optional && fieldValue === undefined) {
                return undefined;
            }
            return (
                <HorizontalBox key={fieldKey}>
                    {fieldTypeData.ShowName && (
                        <Text
                            Text={`${fieldTypeData.CnName}:`}
                            Tip={fieldTypeData.Tip || fieldKey}
                        />
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
            ] as Scheme;
            return (
                <HorizontalBox key={arrayFieldKey}>
                    <SlotText Text={arrayFieldKey} Tip={arrayTypeData.Tip || arrayFieldKey} />
                    <Btn
                        Text={'✚'}
                        Tip={'添加'}
                        OnClick={(): void => {
                            this.AddArrayItem(
                                arrayFieldKey,
                                arrayFieldValue as unknown[],
                                arrayTypeData as ArrayScheme,
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
            ] as Scheme;
            if (!(fieldTypeData.Optional && fieldValue === undefined)) {
                newLine.push(
                    <HorizontalBox key={id}>
                        {fieldTypeData.ShowName && (
                            <Text
                                Text={`${fieldTypeData.CnName}:`}
                                Tip={fieldTypeData.Tip || fieldKey}
                            />
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
