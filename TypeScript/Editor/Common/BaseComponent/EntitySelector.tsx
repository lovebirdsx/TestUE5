/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { entityListCache } from '../EntityListCache';
import LevelEditorUtil from '../LevelEditorUtil';
import { Btn } from './CommonComponent';
import { FilterableList } from './FilterableList';

export interface IEntitySelectorProps {
    Id: number;
    OnEntityChanged: (id: number) => void;
}

export class EntitySelector extends React.Component<IEntitySelectorProps> {
    private GetNames(): string[] {
        return entityListCache.GetNames();
    }

    private get SelectedName(): string {
        const props = this.props;
        const entity = entityListCache.GetEntityById(props.Id);
        if (entity) {
            return entity.ActorLabel ? entity.ActorLabel : '';
        }
        return '';
    }

    private readonly OnClickBtnAssign = (): void => {
        const entity = LevelEditorUtil.GetSelectedEntity();
        if (entity && entity.Id !== this.props.Id) {
            this.props.OnEntityChanged(entity.Id);
        }
    };

    private readonly OnClickBtnNav = (): void => {
        const entity = entityListCache.GetEntityById(this.props.Id);
        if (entity) {
            LevelEditorUtil.SelectActor(entity);
            LevelEditorUtil.FocusSelected();
        }
    };

    private readonly OnSelectChanged = (name: string): void => {
        const props = this.props;
        const entity = entityListCache.GetEntityByLable(name);
        if (entity && entity.Id !== props.Id) {
            props.OnEntityChanged(entity.Id);
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
