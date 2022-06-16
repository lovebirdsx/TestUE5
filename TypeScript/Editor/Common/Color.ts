/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { LinearColor } from 'react-umg';

export type TColor =
    | '#000000 black'
    | '#0A0A0A very dark'
    | '#2c7ad6 level1'
    | '#4ec9a4 level4'
    | '#8A2BE2 level2'
    | '#8B0000 error'
    | '#8B4513 level3'
    | '#008000 green'
    | '#060606 ue back'
    | '#383838 dark'
    | '#434949 disable'
    | '#575757 hover'
    | '#CD5C5C indian red'
    | '#d4d4d4 edit text'
    | '#d4d4d4 text'
    | '#FF0000 red'
    | '#FF8C00 dark orange'
    | '#FFFFFF white';

export function formatColor(color: TColor): LinearColor {
    const num = parseInt(color.slice(1, 7), 16);
    const b = (num & 0xff) / 255;
    const g = ((num & 0xff00) >>> 8) / 255;
    const r = ((num & 0xff0000) >>> 16) / 255;
    return { R: r, G: g, B: b, A: 1 };
}
