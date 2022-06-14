/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { TComponentType } from '../../Game/Interface/IComponent';
import { TComponentData, TComponentsData } from '../../Game/Interface/IEntity';
import { Check, COLOR_DISABLE, COLOR_LEVEL4, Text } from '../Common/BaseComponent/CommonComponent';
import { ContextBtn } from '../Common/BaseComponent/ContextBtn';
import { componentRegistry } from '../Common/Scheme/Component/Public';
import { Any } from '../Common/SchemeComponent/Basic/Public';
import { TModifyType } from '../Common/Type';
import { copyObject, pasteObject } from '../Common/Util';

export interface IComponentsDataProps {
    Value: TComponentsData;
    ComponentTypes: TComponentType[];
    OnModify: (value: TComponentsData, type: TModifyType) => void;
}

export class ComponentsData extends React.Component<IComponentsDataProps> {
    private RenderPrefix(
        componentData: TComponentData,
        componentType: TComponentType,
    ): JSX.Element {
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
                                draft[componentType].Disabled = !isEnabled;
                            });
                            this.props.OnModify(newComponentsData, 'normal');
                        } else {
                            const scheme = componentRegistry.GetScheme(componentType);
                            const newComponentsData = produce(componentsData, (draft) => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                const componentData = scheme.CreateDefault() as TComponentData;
                                draft[componentType] = componentData;
                            });
                            this.props.OnModify(newComponentsData, 'normal');
                        }
                    }}
                />
                <Text
                    Text={componentType}
                    Color={componentData.Disabled ? COLOR_DISABLE : COLOR_LEVEL4}
                />
                <ContextBtn
                    Commands={['拷贝', '粘贴']}
                    OnCommand={function (cmd: string): void {
                        switch (cmd) {
                            case '拷贝':
                                copyObject(componentType, componentData);
                                break;
                            case '粘贴': {
                                const newComponentsData = produce(componentsData, (draft) => {
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                    draft[componentType] =
                                        pasteObject<TComponentData>(componentType);
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
        const componentTypes = this.props.ComponentTypes;
        const components = this.props.Value;

        const elements = componentTypes.map((componentType, id): JSX.Element => {
            if (!componentRegistry.HasScheme(componentType)) {
                return undefined;
            }

            const scheme = componentRegistry.GetScheme(componentType);
            let value = components[componentType];
            if (!value) {
                value = scheme.CreateDefault() as TComponentData;
            }

            return (
                <VerticalBox key={id}>
                    <Any
                        PrefixElement={this.RenderPrefix(value, componentType)}
                        Value={value}
                        Scheme={scheme}
                        OnModify={(obj, type): void => {
                            const newComponentData = produce(this.props.Value, (draft) => {
                                draft[componentType] = obj as TComponentData;
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
