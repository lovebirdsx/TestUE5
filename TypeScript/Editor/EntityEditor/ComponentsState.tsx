/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { TModifyType } from '../../Common/Type';
import { TComponentClass, TComponentsState, TComponentState } from '../../Game/Interface';
import { componentRegistry } from '../../Game/Scheme/Component/Public';
import { Check, Text } from '../Common/BaseComponent/CommonComponent';
import { Any } from '../Common/SchemeComponent/Public';

export interface IComponentsStateProps {
    Value: TComponentsState;
    ClassObjs: TComponentClass[];
    OnModify: (value: TComponentsState, type: TModifyType) => void;
}

export class ComponentsState extends React.Component<IComponentsStateProps> {
    private RenderPrefix(value: TComponentState, componentName: string): JSX.Element {
        return (
            <HorizontalBox>
                <Check
                    UnChecked={value._Disabled}
                    OnChecked={(isEnabled): void => {
                        // disable或者针对合法的Component数据进行enable, 都只需要修改Disabled字段
                        // 否则就要重新生成Component的合法数据
                        if (!isEnabled || Object.keys(value).length > 1) {
                            const newComponentsState = produce(this.props.Value, (draft) => {
                                draft[componentName]._Disabled = !isEnabled;
                            });
                            this.props.OnModify(newComponentsState, 'normal');
                        } else {
                            const scheme = componentRegistry.GetScheme(componentName);
                            const newComponentsState = produce(this.props.Value, (draft) => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                const componentState = scheme.CreateDefault() as TComponentState;
                                componentState._Disabled = false;
                                draft[componentName] = componentState;
                            });
                            this.props.OnModify(newComponentsState, 'normal');
                        }
                    }}
                />
                <Text Text={componentName} />
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
