/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { IProps, TModifyType } from '../../../../Common/Type';
import { EntityTemplateOp } from '../../../../Game/Common/Operations/EntityTemplate';
import { IEntityData, TComponentsData } from '../../../../Game/Interface';
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
    TempleData: TComponentsData;
}

export class TempleData extends React.Component<IProps<number>, IState> {
    public constructor(props: IProps<number>) {
        super(props);
        this.state = {
            IsFolded: false,
            TempleData: null,
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
        // 保存json
        const id = this.props.Value;
        const path = EntityTemplateOp.GetPath(id);
        if (path) {
            EditorEntityTemplateOp.Save(data, path);
        }
        EntityTemplateOp.RefreshTemplate(id);

        // 更新
        this.setState((state) => {
            const newState = produce(this.state, (draft) => {
                draft.TempleData = data.ComponentsData;
                draft.StepId++;
            });
            return newState;
        });
    };

    private RenderTemple(): JSX.Element {
        const template = EntityTemplateOp.GetTemplateById(this.props.Value);
        if (!template) {
            return undefined;
        }
        const componentsState = this.state.TempleData
            ? this.state.TempleData
            : template.ComponentsData;
        const entityType = getEntityTypeByBlueprintId(template.BlueprintType);
        const componentClassObjs = getComponentsTypeByEntityType(entityType);

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
                    {!this.state.IsFolded && this.RenderTemple()}
                </VerticalBox>
            </VerticalBox>
        );
    }
}
