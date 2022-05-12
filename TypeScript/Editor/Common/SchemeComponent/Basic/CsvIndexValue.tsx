/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { editorConfig } from '../../../../Common/EditorConfig';
import { csvOp } from '../../../../Common/CsvOp';
import { CsvIndexValueScheme, IProps, TCsvValueType } from '../../../../Common/Type';
import { csvRegistry } from '../../../../Game/Common/CsvConfig/CsvRegistry';
import { Btn, List } from '../../BaseComponent/CommonComponent';
import { sendEditorCommand } from '../../Util';

function openCsvEditor(csvName: string): void {
    editorConfig.CsvName = csvName;
    editorConfig.Save();

    sendEditorCommand('RestartCsvEditor');
}

export class CsvIndexValue extends React.Component<
    IProps<TCsvValueType, CsvIndexValueScheme<TCsvValueType>>
> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        const scheme = props.Scheme;
        const csvName = scheme.CsvName;
        const csv = csvRegistry.Load(csvName);
        const indexField = scheme.IndexField;
        const valueField = scheme.ValueField;
        const [ids, values] = csvOp.GetIndexsAndValues<TCsvValueType, string>(
            csv,
            indexField,
            valueField,
        );

        if (!ids || !values) {
            throw new Error(
                `Can not create csv index scheme [${csvName}] [${indexField}] [${valueField}]`,
            );
        }

        const id = props.Value;
        const selected = values[ids.indexOf(id)];

        return (
            <HorizontalBox>
                <List
                    Items={values}
                    Selected={selected}
                    Tip={`CSV配置[${csvName}]中的[${valueField}]列`}
                    OnSelectChanged={function (item: string): void {
                        const newId = ids[values.indexOf(item)];
                        props.OnModify(newId, 'normal');
                    }}
                />
                <Btn
                    Text={'⊙'}
                    OnClick={(): void => {
                        openCsvEditor(csvName);
                    }}
                    Tip={`打开Csv配置[${csvName}]`}
                />
            </HorizontalBox>
        );
    }
}
