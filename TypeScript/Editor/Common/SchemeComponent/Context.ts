/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { ICsv } from '../../../Game/Common/CsvConfig/CsvLoader';
import { IFlowInfo, IInvoke, IShowTalk } from '../../../Game/Interface/IAction';
import { ArrayScheme } from '../Type';

export const flowContext = React.createContext<IFlowInfo>(undefined);

export interface ICsvCellContext {
    RowId: number;
    ColId: number;
    Csv: ICsv;
}

export const csvCellContext = React.createContext<ICsvCellContext>(undefined);

export const showTalkContext = React.createContext<IShowTalk>(undefined);

export const invokeContext = React.createContext<IInvoke>(undefined);

export interface IArrayContext {
    Scheme: ArrayScheme;
    Array: unknown[];
}

export const arrayContext = React.createContext<IArrayContext>({
    Scheme: undefined,
    Array: undefined,
});

export const entityIdContext = React.createContext<number>(undefined);
