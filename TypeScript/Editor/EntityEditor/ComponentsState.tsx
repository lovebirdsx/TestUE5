/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { VerticalBox } from 'react-umg';

import { ObjectScheme, TModifyType } from '../../Common/Type';
import { TComponentClass, TComponentsState } from '../../Game/Interface';
import { componentRegistry } from '../../Game/Scheme/Component/Index';
import { Text } from '../Common/BaseComponent/CommonComponent';
import { Obj } from '../Common/SchemeComponent/Public';

export interface IComponentsStateProps {
    Value: TComponentsState;
    ClassObjs: TComponentClass[];
    OnModify: (value: TComponentsState, type: TModifyType) => void;
}

export class ComponentsState extends React.Component<IComponentsStateProps> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const classObjs = this.props.ClassObjs;
        const components = this.props.Value;

        const elements = classObjs.map((classObj, id): JSX.Element => {
            if (!componentRegistry.HasScheme(classObj.name)) {
                return undefined;
            }

            const scheme = componentRegistry.GetScheme(classObj.name);
            let value = components[classObj.name];
            if (!value) {
                value = scheme.CreateDefault() as Record<string, unknown>;
            }

            return (
                <VerticalBox key={id}>
                    <Obj
                        PrefixElement={<Text Text={classObj.name} />}
                        Value={value}
                        Scheme={scheme as ObjectScheme<Record<string, unknown>>}
                        OnModify={(obj, type): void => {
                            const newComponentState = produce(this.props.Value, (draft) => {
                                draft[classObj.name] = obj;
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
