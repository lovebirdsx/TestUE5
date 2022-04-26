/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { ObjectScheme, TModifyType } from '../../Common/Type';
import { parseComponentsState } from '../../Game/Entity/Interface';
import TsEntity from '../../Game/Entity/TsEntity';
import { Btn, SlotText } from '../Common/BaseComponent/CommonComponent';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { editorEntityRegistry, TEntityPureData } from '../Common/Scheme/Entity/Public';
import { Obj } from '../Common/SchemeComponent/Public';
import { ComponentsState } from './ComponentsState';

export interface IEntityViewProps {
    Entity: TsEntity;
    PureData: TEntityPureData;
    OnModify: (data: TEntityPureData, type: TModifyType) => void;
}

export class EntityView extends React.Component<IEntityViewProps> {
    private readonly OnClickBtnNav = (): void => {
        LevelEditorUtil.SelectActor(this.props.Entity);
        LevelEditorUtil.FocusSelected();
    };

    private readonly OnClickBtnFocusBlueprint = (): void => {
        LevelEditorUtil.FocusOnSelectedBlueprint(this.props.Entity);
    };

    private RenderPrefixElement(): JSX.Element {
        const entity = this.props.Entity;
        return (
            <HorizontalBox>
                <SlotText Text={entity.GetName()} />
                <Btn Text={'◉'} OnClick={this.OnClickBtnNav} Tip={'在场景中选中对应的Entity'} />
                <Btn
                    Text={'⊙'}
                    OnClick={this.OnClickBtnFocusBlueprint}
                    Tip={'浏览到Entity蓝图所在位置'}
                />
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
                    Scheme={scheme as ObjectScheme<TEntityPureData>}
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
