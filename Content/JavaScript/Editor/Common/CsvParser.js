"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyCsv = exports.parseCsv = void 0;
function parseCsv(text) {
    let p = '';
    let row = [''];
    const ret = [row];
    let i = 0;
    let r = 0;
    let s = !0;
    // eslint-disable-next-line no-restricted-syntax
    for (let l of text) {
        if (l === '"') {
            if (s && l === p) {
                row[i] += l;
            }
            s = !s;
        }
        else if (l === ',' && s) {
            row[++i] = '';
            l = '';
        }
        else if (l === '\n' && s) {
            if (p === '\r') {
                row[i] = row[i].slice(0, -1);
            }
            row = [(l = '')];
            ret[++r] = row;
            i = 0;
        }
        else {
            row[i] += l;
        }
        p = l;
    }
    const lastRow = ret[ret.length - 1];
    if (lastRow.length === 1 && lastRow[0] === '') {
        ret.splice(ret.length - 1, 1);
    }
    return ret;
}
exports.parseCsv = parseCsv;
function stringifyCsv(rows) {
    const lines = rows.map((tockens) => {
        const formatedTockens = tockens.map((t) => {
            let addEscape = false;
            for (let i = 0; i < t.length; i++) {
                const current = t[i];
                const prev = t[i - 1];
                if (current === ',' || current === '"' || (prev === '\r' && current === '\n')) {
                    addEscape = true;
                }
            }
            if (addEscape) {
                return `"${t.replace(/"/g, '""')}"`;
            }
            return t;
        });
        return formatedTockens.join(',');
    });
    return lines.join('\r\n');
}
exports.stringifyCsv = stringifyCsv;
//# sourceMappingURL=CsvParser.js.map