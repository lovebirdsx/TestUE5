/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { error } from '../../Common/Log';
import { TModifyType } from '../../Common/Type';
import { openLoadJsonFileDialog, openSaveJsonFileDialog } from '../../Common/UeHelper';
import { getGuid } from '../../Common/Util';
import { EntityTemplateOp } from '../../Game/Common/Operations/EntityTemplate';
import { entityRegistry } from '../../Game/Entity/EntityRegistry';
import { IEntityData, ITsEntity } from '../../Game/Interface';
import { Btn, ErrorText, H3, Text } from '../Common/BaseComponent/CommonComponent';
import { editorConfig } from '../Common/EditorConfig';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { entityIdContext } from '../Common/SchemeComponent/Context';
import { openFile } from '../Common/Util';
import { ComponentsData } from './ComponentsData';

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

    private readonly OnClickBtnOpenJson = (): void => {
        const entityEditorSavePath = LevelEditorUtil.GetEntityJsonPath(this.props.Entity);
        openFile(entityEditorSavePath);
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

    private readonly FixGuid = (): void => {
        const newPureData = produce(this.props.Data, (draft) => {
            draft.Guid = getGuid(this.props.Entity);
        });
        this.props.OnModify(newPureData, 'normal');
    };

    private RenderGuid(): JSX.Element {
        const guid = this.props.Data.Guid;
        if (guid) {
            const needFixGuid = guid !== getGuid(this.props.Entity);
            return (
                <HorizontalBox>
                    <Text Text={`Guid: ${guid}`} />
                    {needFixGuid && (
                        <Btn Text={`修复`} Color={'#8B0000 error'} OnClick={this.FixGuid} />
                    )}
                </HorizontalBox>
            );
        }

        return <Btn Color="#FF0000 red" Text={'修复Guid'} OnClick={this.FixGuid} />;
    }

    private RenderEntityInfo(): JSX.Element {
        return (
            <HorizontalBox>
                {this.RenderGuid()}
                <Btn Text={'◉'} OnClick={this.OnClickBtnNav} Tip={'在场景中选中对应的Entity'} />
                <Btn
                    Text={'⊙'}
                    OnClick={this.OnClickBtnFocusBlueprint}
                    Tip={'浏览到Entity蓝图所在位置'}
                />
                <Btn Text={'J'} OnClick={this.OnClickBtnOpenJson} Tip={'打开实体对应的Json配置'} />
                <Btn Text={'S'} Tip={'存储为模板'} OnClick={this.OnClickSaveTemplate} />
                <Btn Text={'L'} Tip={'从模板读取'} OnClick={this.OnClickLoadTemplate} />
            </HorizontalBox>
        );
    }

    private RenderEntityError(): JSX.Element {
        const errorMessages: string[] = [];
        if (entityRegistry.Check(this.props.Data, this.props.Entity, errorMessages) <= 0) {
            return undefined;
        }

        error(`实体配置错误:\n${errorMessages.join('\r\n')}`);
        return (
            <VerticalBox>
                <H3 Text={'错误'} />
                {errorMessages.map((text, id) => (
                    <ErrorText key={id} Text={text} />
                ))}
            </VerticalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        const entity = props.Entity;
        const data = props.Data;
        const componentsState = data.ComponentsData;
        const componentClassObjs = entityRegistry.GetComponentClassesByActor(entity);

        return (
            <VerticalBox>
                <VerticalBox>
                    {this.RenderEntityError()}
                    <H3 Text={`实体信息(${entity.ActorLabel})`} />
                    {this.RenderEntityInfo()}
                </VerticalBox>
                <H3 Text={'组件列表'} />
                <entityIdContext.Provider value={entity.Guid}>
                    <ComponentsData
                        Value={componentsState}
                        ClassObjs={componentClassObjs}
                        OnModify={(componentState, type): void => {
                            const newData = produce(data, (draft) => {
                                draft.ComponentsData = componentState;
                            });
                            props.OnModify(newData, type);
                        }}
                    />
                </entityIdContext.Provider>
            </VerticalBox>
        );
    }
}
