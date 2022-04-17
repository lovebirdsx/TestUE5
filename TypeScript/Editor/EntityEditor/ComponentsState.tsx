/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { VerticalBox } from 'react-umg';

import { TModifyType } from '../../Common/Type';
import { TComponentClass } from '../../Game/Entity';
import { IComponentsState } from '../../Game/Entity/Interface';
import { Obj } from '../Common/ReactComponent/Dynamic';
import { componentRegistry } from '../Common/Scheme/Component/Index';

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
                value = scheme.CreateDefault(undefined) as Record<string, unknown>;
            }

            return (
                <Obj
                    key={id}
                    Value={value}
                    Type={scheme}
                    OnModify={(obj, type): void => {
                        const newComponentState = produce(this.props.Value, (draft) => {
                            draft.Components[classObj.name] = obj as Record<string, unknown>;
                        });
                        this.props.OnModify(newComponentState, type);
                    }}
                />
            );
        });

        return <VerticalBox>{elements}</VerticalBox>;
    }
}
