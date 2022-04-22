/* eslint-disable spellcheck/spell-checker */
import produce from 'immer';
import * as React from 'react';
import { EFileRoot, MyFileHelper } from 'ue';

import { ICsv } from '../../Common/CsvLoader';
import { TalkerCsvLoader } from '../../Game/Common/CsvConfig/TalkerCsv';
import { CsvView } from '../Common/ExtendComponent/CsvView';
import { editorCsvOp } from '../Common/Operations/CsvOp';

const TALKER_LIST_CSV_PATH = 'Data/Tables/d.对话人.csv';

interface ITestCsvState {
    Csv: ICsv;
    FilterTexts: string[];
}

export class TestCsvView extends React.Component<unknown, ITestCsvState> {
    public constructor(props: unknown) {
        super(props);
        const loader = new TalkerCsvLoader();
        const path = MyFileHelper.GetPath(EFileRoot.Content, TALKER_LIST_CSV_PATH);
        const csv = loader.LoadCsv(path);
        this.state = {
            Csv: csv,
            FilterTexts: csv.FiledTypes.map(() => ''),
        };
    }

    private readonly OnModify = (csv: ICsv): void => {
        this.setState({ Csv: csv });
    };

    private readonly OnModifyFilterTexts = (id: number, text: string): void => {
        const newFilterTexts = produce(this.state.FilterTexts, (draft) => {
            draft[id] = text;
        });
        this.setState({ FilterTexts: newFilterTexts });
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        editorCsvOp.Log(this.state.Csv);
        return (
            <CsvView
                Csv={this.state.Csv}
                OnModify={this.OnModify}
                FilterTexts={this.state.FilterTexts}
                OnModifyFilterTexts={this.OnModifyFilterTexts}
            />
        );
    }
}
