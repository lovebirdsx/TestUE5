/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { TModifyType } from '../../Common/Type';
import { parseComponentsState } from '../../Game/Entity/Interface';
import TsEntity from '../../Game/Entity/TsEntity';
import LevelEditor from '../Common/LevelEditor';
import { Btn, SlotText } from '../Common/BaseComponent/CommonComponent';
import { Obj } from '../Common/SchemeComponent/Basic/Public';
import { editorEntityRegistry, TEntityPureData } from '../Common/Scheme/Entity/Public';
import { ComponentsState } from './ComponentsState';

export interface IEntityViewProps {
    Entity: TsEntity;
    PureData: TEntityPureData;
    OnModify: (data: TEntityPureData, type: TModifyType) => void;
}

export class EntityView extends React.Component<IEntityViewProps> {
    private readonly OnClickBtnNav = (): void => {
        LevelEditor.SelectActor(this.props.Entity);
        LevelEditor.FocusSelected();
    };

    private RenderPrefixElement(): JSX.Element {
        const entity = this.props.Entity;
        return (
            <HorizontalBox>
                <SlotText Text={entity.GetName()} />
                <Btn Text={'⊙'} OnClick={this.OnClickBtnNav} Tip={'选中对应的Entity'} />
            </HorizontalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        const entity = props.Entity;
        const pureData = props.PureData;
        const scheme = editorEntityRegistry.GetSchemeByEntity(entity);

        const componentsState = parseComponentsState(pureData.ComponentsStateJson);
        const componentClassObjs = editorEntityRegistry.GetComponentClasses(entity);

        return (
            <VerticalBox>
                <Obj
                    PrefixElement={this.RenderPrefixElement()}
                    Value={pureData}
                    Scheme={scheme}
                    OnModify={props.OnModify}
                />
                <ComponentsState
                    Value={componentsState}
                    ClassObjs={componentClassObjs}
                    OnModify={(data, type): void => {
                        const newPureData = produce(pureData, (draft) => {
                            draft.ComponentsStateJson = JSON.stringify(data);
                        });
                        props.OnModify(newPureData, type);
                    }}
                />
            </VerticalBox>
        );
    }
}
