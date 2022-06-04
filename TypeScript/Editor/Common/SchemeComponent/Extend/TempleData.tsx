/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox, VerticalBox } from 'react-umg';

import { getBlueprintClass, getTsClassByUeClass } from '../../../../Common/Class';
import { IProps, TModifyType } from '../../../../Common/Type';
import { EntityTemplateOp } from '../../../../Game/Common/Operations/EntityTemplate';
import { entityRegistry } from '../../../../Game/Entity/Public';
import { IEntityData } from '../../../../Game/Interface';
import { ITempleGuid } from '../../../../Game/Interface/Component';
import { ComponentsData } from '../../../EntityEditor/ComponentsData';
import { Btn, Fold, TAB_OFFSET } from '../../BaseComponent/CommonComponent';
import { FilterableList } from '../../BaseComponent/FilterableList';
import { openFile } from '../../Util';

interface IState {
    IsFolded: boolean;
}

export class TempleData extends React.Component<IProps<ITempleGuid>, IState> {
    public constructor(props: IProps<ITempleGuid>) {
        super(props);
        this.state = {
            IsFolded: false,
        };
    }

    private readonly OpenEntityTemplate = (): void => {
        const templateFile = EntityTemplateOp.GetPath(this.props.Value.TempleGuid);
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
        const template = EntityTemplateOp.GetTemplateByGuid(this.props.Value.TempleGuid);
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
                            //draft.ComponentsData = componentState;
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
                        Selected={EntityTemplateOp.GetNameByGuid(this.props.Value.TempleGuid)}
                        OnSelectChanged={(name: string): void => {
                            const newData = produce(this.props.Value, (draft) => {
                                draft.TempleGuid = EntityTemplateOp.GetGuidByName(name);
                            });
                            this.props.OnModify(newData, 'normal');
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
