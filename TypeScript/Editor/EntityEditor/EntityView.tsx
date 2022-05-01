/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { TModifyType } from '../../Common/Type';
import { genGuid } from '../../Common/Util';
import { entityRegistry } from '../../Game/Entity/EntityRegistry';
import { ITsEntity, TEntityPureData } from '../../Game/Interface';
import { Btn, H3, Text } from '../Common/BaseComponent/CommonComponent';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { ComponentsState } from './ComponentsState';

export interface IEntityViewProps {
    Entity: ITsEntity;
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

    private RenderEntityInfo(): JSX.Element {
        const entity = this.props.Entity;
        return (
            <HorizontalBox>
                <Text Text={entity.GetName()} />
                <Btn Text={'◉'} OnClick={this.OnClickBtnNav} Tip={'在场景中选中对应的Entity'} />
                <Btn
                    Text={'⊙'}
                    OnClick={this.OnClickBtnFocusBlueprint}
                    Tip={'浏览到Entity蓝图所在位置'}
                />
            </HorizontalBox>
        );
    }

    private readonly FixGuid = (): void => {
        const newPureData = produce(this.props.PureData, (draft) => {
            draft.Guid = genGuid();
        });
        this.props.OnModify(newPureData, 'normal');
    };

    private RenderGuid(): JSX.Element {
        const guid = this.props.PureData.Guid;
        if (guid) {
            return <Text Text={`Guid: ${guid}`} />;
        }

        return <Btn Color="#FF0000 red" Text={'修复Guid'} OnClick={this.FixGuid} />;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        const entity = props.Entity;
        const pureData = props.PureData;

        // pureData中ComponentsStateJson不是字符串,而是解析之后的数据
        const componentsState = pureData.ComponentsStateJson;
        const componentClassObjs = entityRegistry.GetComponentClassesByActor(entity);

        return (
            <VerticalBox>
                <VerticalBox>
                    <H3 Text={'Entity'} />
                    {this.RenderGuid()}
                    {this.RenderEntityInfo()}
                </VerticalBox>
                <H3 Text={'Components'} />
                <ComponentsState
                    Value={componentsState}
                    ClassObjs={componentClassObjs}
                    OnModify={(data, type): void => {
                        const newPureData = produce(pureData, (draft) => {
                            draft.ComponentsStateJson = data;
                        });
                        props.OnModify(newPureData, type);
                    }}
                />
            </VerticalBox>
        );
    }
}
