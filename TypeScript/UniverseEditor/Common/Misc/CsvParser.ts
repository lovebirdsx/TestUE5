/* eslint-disable spellcheck/spell-checker */

export function parseCsv(text: string): string[][] {
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
        } else if (l === ',' && s) {
            row[++i] = '';
            l = '';
        } else if (l === '\n' && s) {
            if (p === '\r') {
                row[i] = row[i].slice(0, -1);
            }
            row = [(l = '')];
            ret[++r] = row;
            i = 0;
        } else {
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

export function stringifyCsv(rows: string[][]): string {
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

export class LineReader {
    private readonly Lines: string[][];

    private Current: number;

    public constructor(content: string) {
        if (content) {
            this.Lines = parseCsv(content);
            this.Current = 0;
        }
    }

    public ReadNext(): string[] | undefined {
        if (!this.IsEnd) {
            const tockens = this.Lines[this.Current];
            this.Current++;
            return tockens;
        }
        return undefined;
    }

    public get CurrentLineNumber(): number {
        return this.Current;
    }

    public get TotalLine(): number {
        return this.Lines.length;
    }

    public get IsEnd(): boolean {
        return this.Current >= this.Lines.length;
    }

    public get IsValid(): boolean {
        return this.Lines !== undefined;
    }
}

export class LineWriter {
    private readonly Lines: string[][] = [];

    public Write(tockes: string[]): void {
        this.Lines.push(tockes);
    }

    public Gen(): string {
        return stringifyCsv(this.Lines);
    }
}
