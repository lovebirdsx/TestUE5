/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import {
    createArrayScheme,
    createObjectScheme,
    createStringScheme,
    IProps,
    ObjectScheme,
    TModifyType,
} from '../../Common/Type';
import { Btn } from '../Common/BaseComponent/CommonComponent';
import { IEntityRecord, IEntityRecords } from '../Common/Interface';
import LevelEditorUtil from '../Common/LevelEditorUtil';
import { Any, Obj } from '../Common/SchemeComponent/Public';
import { renderRegistry } from '../Common/SchemeComponent/RenderRegistry';

const entityRecordScheme = createObjectScheme<IEntityRecord>({
    Fields: {
        Name: createStringScheme({
            CnName: '名字',
            Name: 'Name',
            MaxWidth: 65,
            IsUnique: true,
        }),
        GuidFilter: createStringScheme({
            CnName: 'Guid过滤字符串',
            Hide: true,
            MaxWidth: 200,
        }),
    },
    NewLine: true,
});

function renderEntityRecord(
    props: IProps<IEntityRecord, ObjectScheme<IEntityRecord>>,
): JSX.Element {
    const record = props.Value;
    return (
        <HorizontalBox>
            <Obj {...props} />
            <Btn
                Text={'⇦'}
                Tip={'引用当前选中实体'}
                OnClick={(): void => {
                    const entity = LevelEditorUtil.GetSelectedEntity();
                    if (entity) {
                        const newRecrod = produce(record, (draft) => {
                            draft.GuidFilter = entity.Guid;
                            draft.Name = entity.ActorLabel;
                        });
                        props.OnModify(newRecrod, 'normal');
                    }
                }}
            />
            <Btn
                Text={'◉'}
                Tip={'在场景中尝试选中引用的实体'}
                OnClick={(): void => {
                    const entity = LevelEditorUtil.FindFirstEntityByGuidFilter(record.GuidFilter);
                    if (entity) {
                        LevelEditorUtil.Focus(entity);
                    }
                }}
            />
        </HorizontalBox>
    );
}

renderRegistry.RegComponent(entityRecordScheme, renderEntityRecord);

const entityRecordsArrayScheme = createArrayScheme<IEntityRecord>({
    CnName: '实体记录列表',
    Tip: '实体记录列表',
    Element: entityRecordScheme,
    ColCount: 3,
    ShowName: false,
    NewLine: true,
});

const entityRecrodsScheme = createObjectScheme<IEntityRecords>({
    Fields: {
        Records: entityRecordsArrayScheme,
    },
    NoIndent: true,
});

export interface IEntityListProps {
    Records: IEntityRecords;
    PrefixElement?: JSX.Element;
    OnModify: (records: IEntityRecords, type: TModifyType) => void;
}

export class EntityRecords extends React.Component<IEntityListProps> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <Any
                PrefixElement={this.props.PrefixElement}
                Scheme={entityRecrodsScheme}
                Value={this.props.Records}
                OnModify={(value, type): void => {
                    this.props.OnModify(value as IEntityRecords, type);
                }}
            />
        );
    }
}
