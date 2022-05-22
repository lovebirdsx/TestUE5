/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { TModifyType } from '../../Common/Type';
import { TComponentClass, TComponentsState, TComponentState } from '../../Game/Interface';
import { componentRegistry } from '../../Game/Scheme/Component/Public';
import { Check, COLOR_DISABLE, COLOR_LEVEL4, Text } from '../Common/BaseComponent/CommonComponent';
import { ContextBtn } from '../Common/BaseComponent/ContextBtn';
import { Any } from '../Common/SchemeComponent/Public';
import { copyObject, pasteObject } from '../Common/Util';

export interface IComponentsStateProps {
    Value: TComponentsState;
    ClassObjs: TComponentClass[];
    OnModify: (value: TComponentsState, type: TModifyType) => void;
}

export class ComponentsState extends React.Component<IComponentsStateProps> {
    private RenderPrefix(componentState: TComponentState, componentName: string): JSX.Element {
        const props = this.props;
        const componentsState = props.Value;
        return (
            <HorizontalBox>
                <Check
                    UnChecked={componentState.Disabled}
                    OnChecked={(isEnabled): void => {
                        // disable或者针对合法的Component数据进行enable, 都只需要修改Disabled字段
                        // 否则就要重新生成Component的合法数据
                        if (!isEnabled || Object.keys(componentState).length > 1) {
                            const newComponentsState = produce(this.props.Value, (draft) => {
                                draft[componentName].Disabled = !isEnabled;
                            });
                            this.props.OnModify(newComponentsState, 'normal');
                        } else {
                            const scheme = componentRegistry.GetScheme(componentName);
                            const newComponentsState = produce(componentsState, (draft) => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                const componentState = scheme.CreateDefault() as TComponentState;
                                componentState.Disabled = false;
                                draft[componentName] = componentState;
                            });
                            this.props.OnModify(newComponentsState, 'normal');
                        }
                    }}
                />
                <Text
                    Text={componentName}
                    Color={componentState.Disabled ? COLOR_DISABLE : COLOR_LEVEL4}
                />
                <ContextBtn
                    Commands={['拷贝', '粘贴']}
                    OnCommand={function (cmd: string): void {
                        switch (cmd) {
                            case '拷贝':
                                copyObject(componentName, componentState);
                                break;
                            case '粘贴': {
                                const newComponentsState = produce(componentsState, (draft) => {
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                    draft[componentName] =
                                        pasteObject<TComponentState>(componentName);
                                });
                                props.OnModify(newComponentsState, 'normal');
                                break;
                            }
                        }
                    }}
                />
            </HorizontalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const classObjs = this.props.ClassObjs;
        const components = this.props.Value;

        const elements = classObjs.map((classObj, id): JSX.Element => {
            if (!componentRegistry.HasScheme(classObj.name)) {
                return undefined;
            }

            const scheme = componentRegistry.GetScheme(classObj.name);
            if (scheme.NoData) {
                return undefined;
            }

            const value = components[classObj.name];
            return (
                <VerticalBox key={id}>
                    <Any
                        PrefixElement={this.RenderPrefix(value, classObj.name)}
                        Value={value}
                        Scheme={scheme}
                        OnModify={(obj, type): void => {
                            const newComponentState = produce(this.props.Value, (draft) => {
                                draft[classObj.name] = obj as TComponentState;
                            });
                            this.props.OnModify(newComponentState, type);
                        }}
                    />
                </VerticalBox>
            );
        });

        return <VerticalBox>{elements}</VerticalBox>;
    }
}
