/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { error } from '../../Common/Log';
import { ITsEntity } from '../../Game/Interface';
import { getEntityTypeByBlueprintType } from '../../Game/Interface/Entity';
import { IEntityData } from '../../Game/Interface/IEntity';
import { Btn, Check, ErrorText, H3, Text } from '../Common/BaseComponent/CommonComponent';
import { EntityTemplateSelector } from '../Common/BaseComponent/EntityTemplateSelector';
import { editorConfig } from '../Common/EditorConfig';
import { entityTemplateManager } from '../Common/EntityTemplateManager';
import { levelDataManager } from '../Common/LevelDataManager';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { entityRegistry } from '../Common/Scheme/Entity';
import { entityIdContext } from '../Common/SchemeComponent/Context';
import { TModifyType } from '../Common/Type';
import { openFile, openSaveJsonFileDialog } from '../Common/Util';
import { ComponentsData } from './ComponentsData';

export interface IEntityViewProps {
    Entity: ITsEntity;
    Data: IEntityData;
    OnModify: (data: IEntityData, type: TModifyType) => void;
}

const TIP_FOR_TEMPLATE = `是否启用模板, 如果启用, 则实体的默认数据从模板中读取.
实体中只保存相对模板改变的数据, 若模板的配置A改变, 且
实体没有改变配置A, 那么实体最终将使用模板的配置A.`;

export class EntityView extends React.Component<IEntityViewProps> {
    private readonly OnClickBtnNav = (): void => {
        LevelEditorUtil.SelectActor(this.props.Entity);
        LevelEditorUtil.FocusSelected();
    };

    private readonly OnClickBtnFocusBlueprint = (): void => {
        LevelEditorUtil.FocusOnSelectedBlueprint(this.props.Entity);
    };

    private readonly OnClickBtnOpenJson = (): void => {
        const entityEditorSavePath = levelDataManager.GetEntityJsonPath(this.props.Entity);
        openFile(entityEditorSavePath);
    };

    private readonly OnClickSaveTemplate = (): void => {
        const path = openSaveJsonFileDialog(editorConfig.LastEntityTemplatePath);
        if (path) {
            editorConfig.LastEntityTemplatePath = path;
            entityTemplateManager.Add(this.props.Data, path);
        }
    };

    private readonly FixGuid = (): void => {
        const newPureData = produce(this.props.Data, (draft) => {
            draft.Id = this.props.Entity.Id;
        });
        this.props.OnModify(newPureData, 'normal');
    };

    private RenderId(): JSX.Element {
        const id = this.props.Data.Id;
        if (!id) {
            return (
                <HorizontalBox>
                    <Text Text={`Id: ${id}`} />
                    <Btn Text={`修复`} Color={'#8B0000 error'} OnClick={this.FixGuid} />
                </HorizontalBox>
            );
        }

        return <Text Text={id.toString()} />;
    }

    private RenderEntityInfo(): JSX.Element {
        const ed = this.props.Data;
        return (
            <HorizontalBox>
                {this.RenderId()}
                <Btn Text={'◉'} OnClick={this.OnClickBtnNav} Tip={'在场景中选中对应的Entity'} />
                <Btn
                    Text={'⊙'}
                    OnClick={this.OnClickBtnFocusBlueprint}
                    Tip={'浏览到Entity蓝图所在位置'}
                />
                <Btn Text={'J'} OnClick={this.OnClickBtnOpenJson} Tip={'打开实体对应的Json配置'} />
                <Btn Text={'S'} Tip={'存储为模板'} OnClick={this.OnClickSaveTemplate} />
                <Text Text={'模板'} Tip={TIP_FOR_TEMPLATE} />
                <Check
                    UnChecked={ed.TemplateId === undefined}
                    OnChecked={this.OnToggleUseTemplate}
                />
                {ed.TemplateId !== undefined && (
                    <EntityTemplateSelector
                        Id={ed.TemplateId}
                        EntityType={getEntityTypeByBlueprintType(ed.BlueprintType)}
                        OnModify={this.OnTemplateIdModifiled}
                    />
                )}
            </HorizontalBox>
        );
    }

    private readonly OnToggleUseTemplate = (checked: boolean): void => {
        const ed = this.props.Data;
        const newPureData = produce(ed, (draft) => {
            if (checked) {
                const prevTemplateId = ed._prevTemplateId || entityTemplateManager.GenDefaultId();
                draft.TemplateId = prevTemplateId;
            } else {
                draft._prevTemplateId = ed.TemplateId;
                draft.TemplateId = undefined;
            }
        });
        this.props.OnModify(newPureData, 'normal');
    };

    private readonly OnTemplateIdModifiled = (id: number): void => {
        const newPureData = produce(this.props.Data, (draft) => {
            draft.TemplateId = id;
        });
        this.props.OnModify(newPureData, 'normal');
    };

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
        const componentTypes = entityRegistry.GetComponentTypes(entity);

        return (
            <VerticalBox>
                <VerticalBox>
                    {this.RenderEntityError()}
                    <H3 Text={`实体信息(${entity.ActorLabel})`} />
                    {this.RenderEntityInfo()}
                </VerticalBox>
                <H3 Text={'组件列表'} />
                <entityIdContext.Provider value={entity.Id}>
                    <ComponentsData
                        Value={componentsState}
                        ComponentTypes={componentTypes}
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
