/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { TModifyType } from '../../Common/Type';
import { openLoadJsonFileDialog, openSaveJsonFileDialog } from '../../Common/UeHelper';
import { EntityTemplateOp } from '../../Game/Common/Operations/EntityTemplate';
import { entityRegistry } from '../../Game/Entity/EntityRegistry';
import { IEntityData, ITsEntity } from '../../Game/Interface';
import { Btn, H3, Text } from '../Common/BaseComponent/CommonComponent';
import { editorConfig } from '../Common/EditorConfig';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { ComponentsState } from './ComponentsState';

export interface IEntityViewProps {
    Entity: ITsEntity;
    Data: IEntityData;
    OnModify: (data: IEntityData, type: TModifyType) => void;
}

export class EntityView extends React.Component<IEntityViewProps> {
    private readonly OnClickBtnNav = (): void => {
        LevelEditorUtil.SelectActor(this.props.Entity);
        LevelEditorUtil.FocusSelected();
    };

    private readonly OnClickBtnFocusBlueprint = (): void => {
        LevelEditorUtil.FocusOnSelectedBlueprint(this.props.Entity);
    };

    private readonly OnClickSaveTemplate = (): void => {
        const path = openSaveJsonFileDialog(editorConfig.LastEntityTemplatePath);
        if (path) {
            editorConfig.LastEntityTemplatePath = path;
            EntityTemplateOp.Save(this.props.Data, path);
        }
    };

    private readonly OnClickLoadTemplate = (): void => {
        const path = openLoadJsonFileDialog(editorConfig.LastEntityTemplatePath);
        if (!path) {
            return;
        }

        const template = EntityTemplateOp.Load(path);
        if (!template) {
            return;
        }

        editorConfig.LastEntityTemplatePath = path;
        const newData = EntityTemplateOp.ProduceEntityData(
            template,
            entityRegistry.GetComponentClassesByActor(this.props.Entity),
            this.props.Data,
        );
        if (newData !== this.props.Data) {
            this.props.OnModify(newData, 'normal');
        }
    };

    private RenderEntityInfo(): JSX.Element {
        // const entity = this.props.Entity;
        return (
            <HorizontalBox>
                {/* <Text Text={entity.GetName()} /> */}
                {this.RenderGuid()}
                <Btn Text={'◉'} OnClick={this.OnClickBtnNav} Tip={'在场景中选中对应的Entity'} />
                <Btn
                    Text={'⊙'}
                    OnClick={this.OnClickBtnFocusBlueprint}
                    Tip={'浏览到Entity蓝图所在位置'}
                />
                <Btn Text={'S'} Tip={'存储为模板'} OnClick={this.OnClickSaveTemplate} />
                <Btn Text={'L'} Tip={'从模板读取'} OnClick={this.OnClickLoadTemplate} />
            </HorizontalBox>
        );
    }

    private readonly FixGuid = (): void => {
        const newPureData = produce(this.props.Data, (draft) => {
            draft.Guid = this.props.Entity.ActorGuid.ToString();
        });
        this.props.OnModify(newPureData, 'normal');
    };

    private RenderGuid(): JSX.Element {
        const guid = this.props.Data.Guid;
        if (guid) {
            const needFixGuid = guid !== this.props.Entity.ActorGuid.ToString();
            return (
                <HorizontalBox>
                    <Text Text={`Guid: ${guid}`} />
                    {needFixGuid && (
                        <Btn Text={`修复`} Color={'#8B0000 dark red'} OnClick={this.FixGuid} />
                    )}
                </HorizontalBox>
            );
        }

        return <Btn Color="#FF0000 red" Text={'修复Guid'} OnClick={this.FixGuid} />;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        const entity = props.Entity;
        const data = props.Data;
        const componentsState = data.ComponentsState;
        const componentClassObjs = entityRegistry.GetComponentClassesByActor(entity);

        return (
            <VerticalBox>
                <VerticalBox>
                    <H3 Text={'实体信息'} />
                    {this.RenderEntityInfo()}
                </VerticalBox>
                <H3 Text={'组件列表'} />
                <ComponentsState
                    Value={componentsState}
                    ClassObjs={componentClassObjs}
                    OnModify={(componentState, type): void => {
                        const newData = produce(data, (draft) => {
                            draft.ComponentsState = componentState;
                        });
                        props.OnModify(newData, type);
                    }}
                />
            </VerticalBox>
        );
    }
}
