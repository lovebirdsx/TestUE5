/* eslint-disable spellcheck/spell-checker */
import { TextListCsvLoader, TextRow } from '../../Common/CsvConfig/TextListCsv';
import { getSavePath } from '../../Common/Misc/File';
import { log } from '../../Common/Misc/Log';
import { assertEq, test } from '../../Common/Misc/Test';

export default function testTextListCsv(): void {
    function testFor(textCount: number): void {
        const caseName = `textCount = ${textCount}`;
        test(caseName, () => {
            const textRows: TextRow[] = [];
            for (let i = 0; i < textCount; i++) {
                textRows.push({
                    Key: BigInt(i + 1),
                    FlowListId: 'test',
                    Id: i + 1,
                    Text: `文本${i + 1}`,
                    Sound: '',
                });
            }
            const csv = new TextListCsvLoader();
            const content = csv.Stringify(textRows);
            const textRowsParsed = csv.Parse(content);
            assertEq(textRowsParsed, textRows, `${caseName} must equal`);
        });
    }

    testFor(0);
    testFor(1);
    testFor(2);
}

export function writeTextListCsv(path: string): void {
    const abPath = getSavePath(path);
    const textRows: TextRow[] = [];
    const addCount = 6;
    for (let i = 0; i < addCount; i++) {
        textRows.push({
            Key: BigInt(i + 1),
            FlowListId: 'test',
            Id: i + 1,
            Text: `文本${i + 1}`,
            Sound: '',
        });
    }
    const csv = new TextListCsvLoader();
    csv.Save(textRows, abPath);
    log(`Write to ${abPath}`);
}

export function readTextListCsv(path: string): void {
    const csv = new TextListCsvLoader();
    const abPath = getSavePath(path);
    const rows = csv.Load(abPath);
    log(JSON.stringify(rows, undefined, 2));
}
