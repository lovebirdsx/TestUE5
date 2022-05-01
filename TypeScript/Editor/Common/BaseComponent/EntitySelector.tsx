/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { entityListCache } from '../EntityListCache';
import LevelEditorUtil from '../LevelEditorUtil';
import { Btn } from './CommonComponent';
import { FilterableList } from './FilterableList';

export interface IEntitySelectorProps {
    Guid: string;
    OnEntityChanged: (guid: string) => void;
}

export class EntitySelector extends React.Component<IEntitySelectorProps> {
    private GetNames(): string[] {
        return entityListCache.GetNames();
    }

    private get SelectedName(): string {
        const props = this.props;
        const entity = entityListCache.GetEntityByGuid(props.Guid);
        return entity ? entity.GetName() : '';
    }

    private readonly OnClickBtnAssign = (): void => {
        const entity = LevelEditorUtil.GetSelectedEntity();
        if (entity && entity.Guid !== this.props.Guid) {
            this.props.OnEntityChanged(entity.Guid);
        }
    };

    private readonly OnClickBtnNav = (): void => {
        const entity = entityListCache.GetEntityByGuid(this.props.Guid);
        if (entity) {
            LevelEditorUtil.SelectActor(entity);
            LevelEditorUtil.FocusSelected();
        }
    };

    private readonly OnSelectChanged = (name: string): void => {
        const props = this.props;
        const entity = entityListCache.GetEntityByName(name);
        if (entity && entity.Guid !== props.Guid) {
            props.OnEntityChanged(entity.Guid);
        }
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <HorizontalBox>
                <FilterableList
                    Items={this.GetNames()}
                    Selected={this.SelectedName}
                    OnSelectChanged={this.OnSelectChanged}
                />
                <Btn
                    Text={'⇦'}
                    OnClick={this.OnClickBtnAssign}
                    Tip={'以当前场景中选中的Entity进行赋值'}
                />
                <Btn Text={'◉'} OnClick={this.OnClickBtnNav} Tip={'在场景中选中'} />
            </HorizontalBox>
        );
    }
}
