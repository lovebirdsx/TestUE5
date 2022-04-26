/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { VerticalBox } from 'react-umg';

import { TComponentClass } from '../../Common/Entity';
import { ObjectScheme, TModifyType } from '../../Common/Type';
import { IComponentsState } from '../../Game/Entity/Interface';
import { SlotText } from '../Common/BaseComponent/CommonComponent';
import { componentRegistry } from '../Common/Scheme/Component/Index';
import { Obj } from '../Common/SchemeComponent/Basic/Public';

export interface IComponentsStateProps {
    Value: IComponentsState;
    ClassObjs: TComponentClass[];
    OnModify: (value: IComponentsState, type: TModifyType) => void;
}

export class ComponentsState extends React.Component<IComponentsStateProps> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const classObjs = this.props.ClassObjs;
        const components = this.props.Value.Components;

        const elements = classObjs.map((classObj, id): JSX.Element => {
            const scheme = componentRegistry.GetScheme(classObj.name);
            let value = components[classObj.name];
            if (!value) {
                value = scheme.CreateDefault() as Record<string, unknown>;
            }

            return (
                <VerticalBox key={id}>
                    <SlotText Text={classObj.name} />
                    <Obj
                        Value={value}
                        Scheme={scheme as ObjectScheme<Record<string, unknown>>}
                        OnModify={(obj, type): void => {
                            const newComponentState = produce(this.props.Value, (draft) => {
                                draft.Components[classObj.name] = obj as Record<string, unknown>;
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
