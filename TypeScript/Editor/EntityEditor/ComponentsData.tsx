/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { TModifyType } from '../../Common/Type';
import { TComponentClass, TComponentData, TComponentsData } from '../../Game/Interface';
import { componentRegistry } from '../../Game/Scheme/Component/Public';
import { Check, COLOR_DISABLE, COLOR_LEVEL4, Text } from '../Common/BaseComponent/CommonComponent';
import { ContextBtn } from '../Common/BaseComponent/ContextBtn';
import { Any } from '../Common/SchemeComponent/Basic/Public';
import { copyObject, pasteObject } from '../Common/Util';

export interface IComponentsDataProps {
    Value: TComponentsData;
    ClassObjs: TComponentClass[];
    OnModify: (value: TComponentsData, type: TModifyType) => void;
}

export class ComponentsData extends React.Component<IComponentsDataProps> {
    private RenderPrefix(componentData: TComponentData, componentName: string): JSX.Element {
        const props = this.props;
        const componentsData = props.Value;
        return (
            <HorizontalBox>
                <Check
                    UnChecked={componentData.Disabled}
                    OnChecked={(isEnabled): void => {
                        // disable或者针对合法的Component数据进行enable, 都只需要修改Disabled字段
                        // 否则就要重新生成Component的合法数据
                        if (!isEnabled || Object.keys(componentData).length > 1) {
                            const newComponentsData = produce(this.props.Value, (draft) => {
                                draft[componentName].Disabled = !isEnabled;
                            });
                            this.props.OnModify(newComponentsData, 'normal');
                        } else {
                            const scheme = componentRegistry.GetScheme(componentName);
                            const newComponentsData = produce(componentsData, (draft) => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                const componentData = scheme.CreateDefault() as TComponentData;
                                componentData.Disabled = false;
                                draft[componentName] = componentData;
                            });
                            this.props.OnModify(newComponentsData, 'normal');
                        }
                    }}
                />
                <Text
                    Text={componentName}
                    Color={componentData.Disabled ? COLOR_DISABLE : COLOR_LEVEL4}
                />
                <ContextBtn
                    Commands={['拷贝', '粘贴']}
                    OnCommand={function (cmd: string): void {
                        switch (cmd) {
                            case '拷贝':
                                copyObject(componentName, componentData);
                                break;
                            case '粘贴': {
                                const newComponentsData = produce(componentsData, (draft) => {
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                    draft[componentName] =
                                        pasteObject<TComponentData>(componentName);
                                });
                                props.OnModify(newComponentsData, 'normal');
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

            let value = components[classObj.name];
            if (!value) {
                value = scheme.CreateDefault() as TComponentData;
            }

            return (
                <VerticalBox key={id}>
                    <Any
                        PrefixElement={this.RenderPrefix(value, classObj.name)}
                        Value={value}
                        Scheme={scheme}
                        OnModify={(obj, type): void => {
                            const newComponentData = produce(this.props.Value, (draft) => {
                                draft[classObj.name] = obj as TComponentData;
                            });
                            this.props.OnModify(newComponentData, type);
                        }}
                    />
                </VerticalBox>
            );
        });

        return <VerticalBox>{elements}</VerticalBox>;
    }
}
