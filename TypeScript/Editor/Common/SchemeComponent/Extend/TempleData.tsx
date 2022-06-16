/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import {
    getComponentsTypeByEntityType,
    getEntityTypeByBlueprintType,
} from '../../../../Game/Interface/Entity';
import { IEntityTemplate, TComponentsData } from '../../../../Game/Interface/IEntity';
import { ComponentsData } from '../../../EntityEditor/ComponentsData';
import { Btn, Fold, TAB_OFFSET, Text } from '../../BaseComponent/CommonComponent';
import { FilterableList } from '../../BaseComponent/FilterableList';
import { entityTemplateManager } from '../../EntityTemplateManager';
import { IProps, TModifyType } from '../../Type';
import { openFile } from '../../Util';
import { entityIdContext } from '../Context';

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
            TempleData: undefined,
            StepId: 0,
        };
    }

    private readonly OpenEntityTemplate = (): void => {
        const templateFile = entityTemplateManager.GetPath(this.props.Value);
        openFile(templateFile);
    };

    private readonly OnFoldChange = (): void => {
        this.setState({
            IsFolded: !this.state.IsFolded,
        });
    };

    private readonly OnTempleModify = (data: IEntityTemplate, type: TModifyType): void => {
        if (type === 'normal') {
            entityTemplateManager.OverrideByEntityData(data);
        }

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
        const template = entityTemplateManager.GetTemplateById(this.props.Value);
        if (!template) {
            return undefined;
        }
        const componentsState = this.state.TempleData
            ? this.state.TempleData
            : template.ComponentsData;
        const entityType = getEntityTypeByBlueprintType(template.BlueprintType);
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

    private RenderSelect(entityId): JSX.Element {
        return (
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
                    Items={entityTemplateManager.GetNamesByEntityType()}
                    Selected={entityTemplateManager.GetNameById(this.props.Value)}
                    OnSelectChanged={(name: string): void => {
                        this.props.OnModify(entityTemplateManager.GetIdByName(name), 'normal');
                    }}
                />
                <Btn Text={'◉'} OnClick={this.OpenEntityTemplate} Tip={'打开实体模板'} />
            </HorizontalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <VerticalBox>
                <entityIdContext.Consumer>
                    {(entityId: number): JSX.Element => this.RenderSelect(entityId)}
                </entityIdContext.Consumer>
                <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                    {!this.state.IsFolded && this.RenderTemple()}
                </VerticalBox>
            </VerticalBox>
        );
    }
}
