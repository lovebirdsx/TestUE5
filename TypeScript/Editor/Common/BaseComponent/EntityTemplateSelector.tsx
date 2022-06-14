/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { TEntityType } from '../../../Game/Interface/IEntity';
import { entityTemplateManager } from '../EntityTemplateManager';
import { openFile } from '../Util';
import { Btn } from './CommonComponent';
import { FilterableList } from './FilterableList';

export interface IEntityTemplateSelectorProps {
    Id: number;
    EntityType?: TEntityType;
    OnModify: (id: number) => void;
}

export class EntityTemplateSelector extends React.Component<IEntityTemplateSelectorProps> {
    private readonly OpenEntityTemplate = (): void => {
        const templateFile = entityTemplateManager.GetPath(this.props.Id);
        openFile(templateFile);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <HorizontalBox>
                <FilterableList
                    Tip={'实体模板名字'}
                    Items={entityTemplateManager.GetNamesByEntityType(this.props.EntityType)}
                    Selected={entityTemplateManager.GetNameById(this.props.Id)}
                    OnSelectChanged={(name: string): void => {
                        this.props.OnModify(entityTemplateManager.GetIdByName(name));
                    }}
                />
                <Btn Text={'◉'} OnClick={this.OpenEntityTemplate} Tip={'打开实体模板'} />
            </HorizontalBox>
        );
    }
}
