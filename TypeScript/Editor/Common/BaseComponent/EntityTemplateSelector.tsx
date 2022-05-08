/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { EntityTemplateOp } from '../../../Game/Common/Operations/EntityTemplate';
import { openDirOfFile } from '../Util';
import { Btn } from './CommonComponent';
import { FilterableList } from './FilterableList';

export interface IEntityTemplateSelectorProps {
    Guid: string;
    OnModify: (guid: string) => void;
}

export class EntityTemplateSelector extends React.Component<IEntityTemplateSelectorProps> {
    private readonly OnClickBtnFocus = (): void => {
        const templateFile = EntityTemplateOp.GetPath(this.props.Guid);
        openDirOfFile(templateFile);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <HorizontalBox>
                <FilterableList
                    Items={EntityTemplateOp.Names}
                    Selected={EntityTemplateOp.GetNameByGuid(this.props.Guid)}
                    OnSelectChanged={(name: string): void => {
                        this.props.OnModify(EntityTemplateOp.GetGuidByName(name));
                    }}
                />
                <Btn Text={'⊙'} OnClick={this.OnClickBtnFocus} Tip={'浏览到实体模板所在位置'} />
            </HorizontalBox>
        );
    }
}
