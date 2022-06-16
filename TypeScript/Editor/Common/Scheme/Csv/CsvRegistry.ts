/* eslint-disable spellcheck/spell-checker */
import { ICsv, TCsvRowBase } from '../../../../Common/CsvConfig/CsvLoader';
import { ECsvName } from '../../../../Common/CsvConfig/CsvRegistry';
import { EditorGlobalCsv } from './Common';
import { EditorExtendedEntityCsv } from './ExtendedEntityCsv';

export type TEditorCsvClass<T extends TCsvRowBase = TCsvRowBase> = new () => EditorGlobalCsv<T>;

interface ICsvItem {
    Name: ECsvName;
    CsvClass: TEditorCsvClass;
}

const csvConfig: ICsvItem[] = [
    {
        Name: ECsvName.ExtendedEntity,
        CsvClass: EditorExtendedEntityCsv,
    },
];

class EditorCsvRegistry {
    private readonly CsvMap: Map<ECsvName, EditorGlobalCsv> = new Map();

    public constructor() {
        csvConfig.forEach((item) => {
            this.CsvMap.set(item.Name, new item.CsvClass());
        });
    }

    public Check(name: ECsvName, iCsv: ICsv, messages: string[]): number {
        const csv = this.CsvMap.get(name);
        if (!csv) {
            return 0;
        }

        csv.Bind(iCsv);
        return csv.Check(messages);
    }
}

export const editorCsvRegistry = new EditorCsvRegistry();
