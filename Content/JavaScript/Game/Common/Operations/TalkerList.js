"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalkerListOp = exports.TALKER_LIST_CSV_PATH = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Log_1 = require("../../../Common/Log");
const TalkerCsv_1 = require("../CsvConfig/TalkerCsv");
exports.TALKER_LIST_CSV_PATH = 'Data/Tables/d.对话人.csv';
class TalkerListOp {
    static Instance;
    static Names;
    static Get() {
        if (!this.Instance) {
            this.Instance = this.Load();
        }
        return this.Instance;
    }
    static GetNames() {
        if (!this.Names) {
            this.Names = this.Get().Talkers.map((e) => e.Name);
        }
        return this.Names;
    }
    static GetId(talkList, talkerName) {
        const talker = talkList.Talkers.find((e) => e.Name === talkerName);
        return talker ? talker.Id : 0;
    }
    static GetName(talkList, talkerId) {
        const talker = talkList.Talkers.find((e) => e.Id === talkerId);
        return talker ? talker.Name : 'Unknown';
    }
    static Load() {
        const realPath = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, exports.TALKER_LIST_CSV_PATH);
        const talkerCsv = new TalkerCsv_1.TalkerCsvLoader();
        const rows = talkerCsv.Load(realPath);
        const talkers = [];
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
    static Save(talkerList) {
        const realPath = ue_1.MyFileHelper.GetPath(ue_1.EFileRoot.Content, exports.TALKER_LIST_CSV_PATH);
        const talkerCsv = new TalkerCsv_1.TalkerCsvLoader();
        const rows = [];
        talkerList.Talkers.forEach((talker) => {
            rows.push({
                Id: talker.Id,
                Name: talker.Name,
            });
        });
        talkerCsv.Save(rows, realPath);
        (0, Log_1.log)(`save talkerList to ${realPath}`);
    }
}
exports.TalkerListOp = TalkerListOp;
//# sourceMappingURL=TalkerList.js.map