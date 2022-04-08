"use strict";
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineWriter = exports.LineReader = void 0;
const CsvParser_1 = require("./CsvParser");
class LineReader {
    lines;
    current;
    constructor(content) {
        if (content) {
            this.lines = (0, CsvParser_1.parseCsv)(content);
            this.current = 0;
        }
    }
    readNext() {
        if (!this.isEnd) {
            const tockens = this.lines[this.current];
            this.current++;
            return tockens;
        }
        return undefined;
    }
    get currentLineNumber() {
        return this.current;
    }
    get totalLine() {
        return this.lines.length;
    }
    get isEnd() {
        return this.current >= this.lines.length;
    }
    get isValid() {
        return this.lines !== undefined;
    }
}
exports.LineReader = LineReader;
class LineWriter {
    lines = [];
    write(tockes) {
        this.lines.push(tockes);
    }
    gen() {
        return (0, CsvParser_1.stringifyCsv)(this.lines);
    }
}
exports.LineWriter = LineWriter;
//# sourceMappingURL=LineStream.js.map