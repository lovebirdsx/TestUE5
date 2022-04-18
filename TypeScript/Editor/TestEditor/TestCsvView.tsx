/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { EFileRoot, MyFileHelper } from 'ue';

import { ICsv } from '../../Common/CsvLoader';
import { TalkerCsvLoader } from '../../Game/Common/CsvConfig/TalkerCsv';
import { editorCsvOp } from '../Common/Operations/CsvOp';
import { CsvView } from '../Common/ReactComponent/CsvView';

const TALKER_LIST_CSV_PATH = 'Data/Tables/d.对话人.csv';

interface ITestCsvState {
    Csv: ICsv;
}

export class TestCsvView extends React.Component<unknown, ITestCsvState> {
    public constructor(props: unknown) {
        super(props);
        const loader = new TalkerCsvLoader();
        const path = MyFileHelper.GetPath(EFileRoot.Content, TALKER_LIST_CSV_PATH);
        this.state = {
            Csv: loader.LoadCsv(path),
        };
    }

    private readonly OnModify = (csv: ICsv): void => {
        this.setState({ Csv: csv });
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        editorCsvOp.Log(this.state.Csv);
        return <CsvView Csv={this.state.Csv} OnModify={this.OnModify} />;
    }
}
