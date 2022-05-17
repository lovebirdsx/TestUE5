/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { globalContexts } from '../../../../Common/GlobalContext';
import {
    ArrayScheme,
    getObjArrayRenderColorForField,
    IProps,
    ObjectScheme,
    Scheme,
    TModifyType,
} from '../../../../Common/Type';
import { Btn, Fold, TAB_OFFSET, Text } from '../../BaseComponent/CommonComponent';
import { ContextBtn } from '../../BaseComponent/ContextBtn';
import { arrayContext, IArrayContext } from '../Context';
import { Any } from './Any';

function getFoldFieldName(key: string): string {
    return `_${key}Folded`;
}

const FOLD_KEY = '_folded';

export class Obj<T> extends React.Component<IProps<T, ObjectScheme<T>>> {
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
        this.props.OnModify(newObj as T, type);
    }

    private readonly OnFoldChange = (isFolded: boolean): void => {
        const { Value: value } = this.props;
        const newValue = produce(value as Record<string, unknown>, (draft) => {
            draft[FOLD_KEY] = isFolded;
        });
        this.props.OnModify(newValue as T, 'fold');
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
        this.ModifyKv(arrayKey, newArrayValue, 'normal', true);
    }

    private readonly OnToggleFiledOptional = (name: string): void => {
        const { Value: value, Scheme: scheme } = this.props;
        const [fieldKey, fieldScheme] = Object.entries(scheme.Fields).find(([key, value]) => {
            const fieldScheme = value as Scheme;
            return fieldScheme.CnName === key;
        });

        const fieldValue = (value as Record<string, unknown>)[fieldKey];
        if (fieldValue !== undefined) {
            this.ModifyKv(fieldKey, undefined, 'normal', true);
        } else {
            this.ModifyKv(fieldKey, (fieldScheme as Scheme).CreateDefault(), 'normal', true);
        }
    };

    private RenderFieldValue(
        fieldKey: string,
        fieldValue: unknown,
        fieldScheme: Scheme,
    ): JSX.Element {
        if (fieldScheme.RenderType === 'array') {
            const fieldFoldKey = getFoldFieldName(fieldKey);
            const { Value: value } = this.props;
            const isFolded =
                typeof value === 'object'
                    ? ((value as Record<string, unknown>)[fieldFoldKey] as boolean)
                    : false;
            return (
                <Any
                    PrefixElement={<Text Text={fieldKey} />}
                    Value={fieldValue}
                    Owner={value}
                    Scheme={fieldScheme}
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
            <arrayContext.Consumer>
                {(value: IArrayContext): JSX.Element => {
                    return (
                        <Any
                            Color={getObjArrayRenderColorForField(
                                fieldKey,
                                fieldValue,
                                value.Array as Record<string, unknown>[],
                                fieldScheme,
                                this.props.Scheme,
                                value.Scheme,
                            )}
                            Value={fieldValue}
                            Owner={this.props.Value}
                            Scheme={fieldScheme}
                            OnModify={(obj: unknown, type: TModifyType): void => {
                                this.ModifyKv(fieldKey, obj, type);
                            }}
                        />
                    );
                }}
            </arrayContext.Consumer>
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
                optinalKeys.push(fieldTypeData.CnName);
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
            const arrayFieldValue = objValue[arrayFieldKey] as unknown[];
            const arrayScheme = objectType.Fields[arrayFieldKey] as ArrayScheme;
            return (
                <HorizontalBox key={arrayFieldKey}>
                    <Text Text={arrayScheme.CnName} Tip={arrayScheme.Tip} />
                    <Btn
                        Text={'✚'}
                        Tip={'添加'}
                        OnClick={(): void => {
                            this.AddArrayItem(arrayFieldKey, arrayFieldValue, arrayScheme);
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
        const xIndent = objectType.NoIndent ? 0 : TAB_OFFSET;
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
                    {optinalKeys.length > 0 && <Text Text="可选" Tip="可选字段" />}
                    {optinalKeys.length > 0 && (
                        <ContextBtn
                            Commands={optinalKeys}
                            OnCommand={this.OnToggleFiledOptional}
                            Tip="加入可选字段, 若字段已经存在, 再次选择将删除"
                        />
                    )}
                </HorizontalBox>
                <VerticalBox RenderTransform={{ Translation: { X: xIndent } }}>
                    {!isFold && newLine}
                </VerticalBox>
            </VerticalBox>
        );
    }
}
