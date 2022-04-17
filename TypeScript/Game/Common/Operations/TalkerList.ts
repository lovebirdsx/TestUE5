/* eslint-disable spellcheck/spell-checker */
import { EFileRoot, MyFileHelper } from 'ue';

import { log } from '../../../Common/Log';
import { TalkerCsvLoader, TalkerRow } from '../CsvConfig/TalkerCsv';

export const TALKER_LIST_CSV_PATH = 'Data/Tables/d.对话人.csv';

export interface ITalkerInfo {
    Id: number;
    Name: string;
}

export interface ITalkerListInfo {
    TalkerGenId: number;
    Talkers: ITalkerInfo[];
}

export class TalkerListOp {
    private static Instance: ITalkerListInfo;

    private static Names: string[];

    public static Get(): ITalkerListInfo {
        if (!this.Instance) {
            this.Instance = this.Load();
        }
        return this.Instance;
    }

    public static GetNames(): string[] {
        if (!this.Names) {
            this.Names = this.Get().Talkers.map((e) => e.Name);
        }
        return this.Names;
    }

    public static GetId(talkList: ITalkerListInfo, talkerName: string): number {
        const talker = talkList.Talkers.find((e) => e.Name === talkerName);
        return talker ? talker.Id : 0;
    }

    public static GetName(talkList: ITalkerListInfo, talkerId: number): string {
        const talker = talkList.Talkers.find((e) => e.Id === talkerId);
        return talker ? talker.Name : 'Unknown';
    }

    public static Load(): ITalkerListInfo {
        const realPath = MyFileHelper.GetPath(EFileRoot.Content, TALKER_LIST_CSV_PATH);
        const talkerCsv = new TalkerCsvLoader();
        const rows = talkerCsv.Load(realPath);
        const talkers = [] as ITalkerInfo[];

        let maxId = 1;
        rows.forEach((row) => {
            talkers.push({
                Id: row.Id,
                Name: row.Name,
            });
            if (row.Id + 1 > maxId) {
                maxId = row.Id + 1;
            }
        });

        return {
            TalkerGenId: maxId,
            Talkers: talkers,
        };
    }

    public static Save(talkerList: ITalkerListInfo): void {
        const realPath = MyFileHelper.GetPath(EFileRoot.Content, TALKER_LIST_CSV_PATH);
        const talkerCsv = new TalkerCsvLoader();
        const rows = [] as TalkerRow[];
        talkerList.Talkers.forEach((talker) => {
            rows.push({
                Id: talker.Id,
                Name: talker.Name,
            });
        });
        talkerCsv.Save(rows, realPath);
        log(`save talkerList to ${realPath}`);
    }
}
