/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { configFile } from '../../Common/ConfigFile';
import { warn } from '../../Common/Log';
import { TModifyType } from '../../Common/Type';
import { openLoadJsonFileDialog, openSaveJsonFileDialog } from '../../Common/UeHelper';
import { readJsonObj, writeJsonObj } from '../../Common/Util';
import { entityRegistry } from '../../Game/Entity/EntityRegistry';
import {
    entityDataToTemplate,
    IEntityData,
    IEntityTemplate,
    ITsEntity,
} from '../../Game/Interface';
import { Btn, H3, Text } from '../Common/BaseComponent/CommonComponent';
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
        const path = openSaveJsonFileDialog(configFile.LastEntityTemplatePath);
        if (path) {
            configFile.LastEntityTemplatePath = path;
            writeJsonObj(entityDataToTemplate(this.props.Data), path);
        }
    };

    private readonly OnClickLoadTemplate = (): void => {
        const path = openLoadJsonFileDialog(configFile.LastEntityTemplatePath);
        if (!path) {
            return;
        }

        const template = readJsonObj<IEntityTemplate>(path);
        if (!template) {
            return;
        }

        let componentsState = template.ComponentsState;
        if (template.PrefabId !== this.props.Data.PrefabId) {
            // 如果两者的实体类型不一样,那么只取模板中共同的Component配置
            const componentsStateNew = Object.assign({}, this.props.Data.ComponentsState);
            let modifyCount = 0;
            for (const key in componentsState) {
                if (componentsStateNew[key]) {
                    componentsStateNew[key] = componentsState[key];
                    modifyCount++;
                }
            }
            if (modifyCount <= 0) {
                warn(`模板中不存在当前实体相关的组件配置`);
                return;
            }
            componentsState = componentsStateNew;
        }

        const newData = produce(this.props.Data, (draft) => {
            draft.ComponentsState = componentsState;
        });

        configFile.LastEntityTemplatePath = path;
        this.props.OnModify(newData, 'normal');
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
                <Btn Text={'另存为模板'} OnClick={this.OnClickSaveTemplate} />
                <Btn Text={'读取模板'} OnClick={this.OnClickLoadTemplate} />
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
            return (
                <HorizontalBox>
                    <Text Text={`Guid: ${guid}`} />
                    <Btn Text={`修复`} OnClick={this.FixGuid} />
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
                    {this.RenderGuid()}
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
