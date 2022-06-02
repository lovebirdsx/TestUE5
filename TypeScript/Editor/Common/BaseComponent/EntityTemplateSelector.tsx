/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { getBlueprintClass, getTsClassByUeClass } from '../../../Common/Class';
import { TModifyType } from '../../../Common/Type';
import { EntityTemplateOp } from '../../../Game/Common/Operations/EntityTemplate';
import { entityRegistry } from '../../../Game/Entity/EntityRegistry';
import { IEntityData } from '../../../Game/Interface';
import { ComponentsData } from '../../EntityEditor/ComponentsData';
import { openFile } from '../Util';
import { Btn, Fold, TAB_OFFSET } from './CommonComponent';
import { FilterableList } from './FilterableList';

export interface IEntityTemplateSelectorProps {
    Guid: string;
    OnModify: (guid: string) => void;
}

interface IState {
    IsFolded: boolean;
}

export class EntityTemplateSelector extends React.Component<IEntityTemplateSelectorProps> {
    private readonly OpenEntityTemplate = (): void => {
        const templateFile = EntityTemplateOp.GetPath(this.props.Guid);
        openFile(templateFile);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <HorizontalBox>
                <FilterableList
                    Tip={'实体模板名字'}
                    Items={EntityTemplateOp.Names}
                    Selected={EntityTemplateOp.GetNameByGuid(this.props.Guid)}
                    OnSelectChanged={(name: string): void => {
                        this.props.OnModify(EntityTemplateOp.GetGuidByName(name));
                    }}
                />
                <Btn Text={'◉'} OnClick={this.OpenEntityTemplate} Tip={'打开实体模板'} />
            </HorizontalBox>
        );
    }
}

export class TemplateSelectorData extends React.Component<IEntityTemplateSelectorProps, IState> {
    public constructor(props: IEntityTemplateSelectorProps) {
        super(props);
        this.state = {
            IsFolded: false,
        };
    }

    private readonly OpenEntityTemplate = (): void => {
        const templateFile = EntityTemplateOp.GetPath(this.props.Guid);
        openFile(templateFile);
    };

    private readonly OnFoldChange = (): void => {
        this.setState({
            IsFolded: !this.state.IsFolded,
        });
    };

    private readonly OnTempleModify = (data: IEntityData, type: TModifyType): void => {
        // 保存进temple的 json
    };

    private CreateTemple(): JSX.Element {
        // Todo 展示模板信息，且支持修改保存
        const template = EntityTemplateOp.GetTemplateByGuid(this.props.Guid);
        const componentsState = template.ComponentsData;
        const actorClass = getBlueprintClass(template.PrefabId);
        const tsClassObj = getTsClassByUeClass(actorClass);
        const componentClassObjs = entityRegistry.GetComponentClassesByTsClass(tsClassObj);
        return (
            <VerticalBox>
                <ComponentsData
                    Value={componentsState}
                    ClassObjs={componentClassObjs}
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
                    <FilterableList
                        Tip={'实体模板名字'}
                        Items={EntityTemplateOp.Names}
                        Selected={EntityTemplateOp.GetNameByGuid(this.props.Guid)}
                        OnSelectChanged={(name: string): void => {
                            this.props.OnModify(EntityTemplateOp.GetGuidByName(name));
                        }}
                    />
                    <Btn Text={'◉'} OnClick={this.OpenEntityTemplate} Tip={'打开实体模板'} />
                    <Fold
                        IsFold={this.state.IsFolded}
                        OnChanged={this.OnFoldChange}
                        IsFull={true}
                        Tip={'展开模板信息'}
                    />
                </HorizontalBox>
                <VerticalBox RenderTransform={{ Translation: { X: TAB_OFFSET } }}>
                    {!this.state.IsFolded && this.CreateTemple()}
                </VerticalBox>
            </VerticalBox>
        );
    }
}
