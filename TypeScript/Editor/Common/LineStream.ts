/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */

import { parseCsv, stringifyCsv } from './CsvParser';

export class LineReader {
    private readonly lines: string[][];

    private current: number;

    public constructor(content: string) {
        if (content) {
            this.lines = parseCsv(content);
            this.current = 0;
        }
    }

    public readNext(): string[] | undefined {
        if (!this.isEnd) {
            const tockens = this.lines[this.current];
            this.current++;
            return tockens;
        }
        return undefined;
    }

    public get currentLineNumber(): number {
        return this.current;
    }

    public get totalLine(): number {
        return this.lines.length;
    }

    public get isEnd(): boolean {
        return this.current >= this.lines.length;
    }

    public get isValid(): boolean {
        return this.lines !== undefined;
    }
}

export class LineWriter {
    private readonly lines: string[][] = [];

    public write(tockes: string[]): void {
        this.lines.push(tockes);
    }

    public gen(): string {
        return stringifyCsv(this.lines);
    }
}
