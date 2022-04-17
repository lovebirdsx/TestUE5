/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */

import { parseCsv, stringifyCsv } from '../../Common/CsvParser';
import { assertEq, test } from '../../Common/Test';

export default function testCsvParser(): void {
    test('parse csv', () => {
        const test = [
            '"one"',
            '"two with escaped """" double quotes"""',
            '"three, with, commas"',
            'four with no quotes',
            '"five with CRLF\r\n"\r\n"2nd line one"',
            '"two with escaped """" double quotes"""',
            '"three, with, commas"',
            'four with no quotes',
            '"five with CRLF\r\n"',
        ].join(',');

        const result = parseCsv(test);

        assertEq(result.length, 2, 'result.length === 2');
        assertEq(result[0].length, 5, 'result[0].length === 5');
        assertEq(result[1].length, 5, 'result[1].length === 5');

        assertEq(result[0][0], 'one', result[0][0]);
        assertEq(result[0][1], 'two with escaped "" double quotes"', result[0][1]);
        assertEq(result[0][2], 'three, with, commas', result[0][2]);
        assertEq(result[0][3], 'four with no quotes', result[0][3]);
        assertEq(result[0][4], 'five with CRLF\r\n', result[0][4]);
        assertEq(result[1][0], '2nd line one', result[1][0]);
        assertEq(result[1][1], 'two with escaped "" double quotes"', result[1][1]);
        assertEq(result[1][2], 'three, with, commas', result[1][2]);
        assertEq(result[1][3], 'four with no quotes', result[1][3]);
        assertEq(result[1][4], 'five with CRLF\r\n', result[1][4]);
    });

    test('stringify csv', () => {
        const test = [
            'one',
            '"two with escaped """" double quotes"""',
            '"three, with, commas"',
            'four with no quotes',
            '"five with CRLF\r\n"\r\n2nd line one',
            '"two with escaped """" double quotes"""',
            '"three, with, commas"',
            'four with no quotes',
            '"five with CRLF\r\n"',
        ].join(',');

        const array = parseCsv(test);
        const content = stringifyCsv(array);
        assertEq(test, content, `content !== origin`);
    });
}
