"use strict";
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
const Test_1 = require("../../Editor/Common/Test");
const CsvParser_1 = require("../Common/CsvParser");
function testCsvParser() {
    (0, Test_1.test)('parse csv', () => {
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
        const result = (0, CsvParser_1.parseCsv)(test);
        (0, Test_1.assertEq)(result.length, 2, 'result.length === 2');
        (0, Test_1.assertEq)(result[0].length, 5, 'result[0].length === 5');
        (0, Test_1.assertEq)(result[1].length, 5, 'result[1].length === 5');
        (0, Test_1.assertEq)(result[0][0], 'one', result[0][0]);
        (0, Test_1.assertEq)(result[0][1], 'two with escaped "" double quotes"', result[0][1]);
        (0, Test_1.assertEq)(result[0][2], 'three, with, commas', result[0][2]);
        (0, Test_1.assertEq)(result[0][3], 'four with no quotes', result[0][3]);
        (0, Test_1.assertEq)(result[0][4], 'five with CRLF\r\n', result[0][4]);
        (0, Test_1.assertEq)(result[1][0], '2nd line one', result[1][0]);
        (0, Test_1.assertEq)(result[1][1], 'two with escaped "" double quotes"', result[1][1]);
        (0, Test_1.assertEq)(result[1][2], 'three, with, commas', result[1][2]);
        (0, Test_1.assertEq)(result[1][3], 'four with no quotes', result[1][3]);
        (0, Test_1.assertEq)(result[1][4], 'five with CRLF\r\n', result[1][4]);
    });
    (0, Test_1.test)('stringify csv', () => {
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
        const array = (0, CsvParser_1.parseCsv)(test);
        const content = (0, CsvParser_1.stringifyCsv)(array);
        (0, Test_1.assertEq)(test, content, `content !== origin`);
    });
}
exports.default = testCsvParser;
//# sourceMappingURL=TestCsvParser.js.map