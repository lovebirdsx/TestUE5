/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { log } from '../../../../Common/Log';
import { IProps, TModifyType } from '../../../../Common/Type';
import { EntityTemplateOp } from '../../../../Game/Common/Operations/EntityTemplate';
import { IEntityData } from '../../../../Game/Interface';
import {
    getComponentsTypeByEntityType,
    getEntityTypeByBlueprintId,
} from '../../../../Game/Interface/Entity';
import { ComponentsData } from '../../../EntityEditor/ComponentsData';
import { Btn, Fold, TAB_OFFSET, Text } from '../../BaseComponent/CommonComponent';
import { FilterableList } from '../../BaseComponent/FilterableList';
import { EditorEntityTemplateOp } from '../../Operations/EntityTemplate';
import { openFile } from '../../Util';

interface IState {
    IsFolded: boolean;
    StepId: number;
}

export class TempleData extends React.Component<IProps<number>, IState> {
    public constructor(props: IProps<number>) {
        super(props);
        this.state = {
            IsFolded: false,
            StepId: 0,
        };
    }

    private readonly OpenEntityTemplate = (): void => {
        const templateFile = EntityTemplateOp.GetPath(this.props.Value);
        openFile(templateFile);
    };

    private readonly OnFoldChange = (): void => {
        this.setState({
            IsFolded: !this.state.IsFolded,
        });
    };

    private readonly OnTempleModify = (data: IEntityData, type: TModifyType): void => {
        // 1. 保存进编辑器 2.保存进temple的 json
        // this.props.OnModify(data, type);
        // const path = EntityTemplateOp.GetPath(this.props.Value);
        // log(`OnTempleModify ${type} ${path} ${this.props.Value}`);
        // if (path) {
        //     log(`saveTemple ${this.props.Value}`);
        //     EditorEntityTemplateOp.Save(data, path);
        // }

        // this.setState({
        //     IsFolded: this.state.IsFolded,
        //     StepId: this.state.StepId + 1,
        // });
    };

    private CreateTemple(): JSX.Element {
        // Todo 展示模板信息，且支持修改保存
        const template = EntityTemplateOp.GetTemplateById(this.props.Value);
        const componentsState = template.ComponentsData;
        const entityType = getEntityTypeByBlueprintId(template.BlueprintId);
        const componentClassObjs = getComponentsTypeByEntityType(entityType);
        log(`CreateTemple ${template.BlueprintId}`);
        return (
            <VerticalBox>
                <ComponentsData
                    Value={componentsState}
                    ComponentTypes={componentClassObjs}
                    OnModify={(componentState, type): void => {
                        const newData = produce(template, (draft) => {
                            draft.ComponentsData = componentState;
                        });
                        this.OnTempleModify(newData, type);
                    }}
                />
            </VerticalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <VerticalBox>
                <HorizontalBox>
                    <Fold
                        IsFold={this.state.IsFolded}
                        OnChanged={this.OnFoldChange}
                        IsFull={true}
                        Tip={'展开模板信息'}
                    />
                    <Text Text={'模板：'} />
                    <FilterableList
                        Tip={'实体模板名字'}
                        Items={EntityTemplateOp.Names}
                        Selected={EntityTemplateOp.GetNameById(this.props.Value)}
                        OnSelectChanged={(name: string): void => {
                            this.props.OnModify(EntityTemplateOp.GetIdByName(name), 'normal');
                        }}
                    />
                    <Btn Text={'◉'} OnClick={this.OpenEntityTemplate} Tip={'打开实体模板'} />
                </HorizontalBox>
                <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                    {!this.state.IsFolded && this.CreateTemple()}
                </VerticalBox>
            </VerticalBox>
        );
    }
}
