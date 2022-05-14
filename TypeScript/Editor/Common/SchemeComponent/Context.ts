/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { ICsv } from '../../../Common/CsvLoader';
import { IFlowInfo, IInvoke, IShowTalk } from '../../../Game/Flow/Action';

export const flowContext = React.createContext<IFlowInfo>(undefined);

export interface ICsvCellContext {
    RowId: number;
    ColId: number;
    Csv: ICsv;
}

export const csvCellContext = React.createContext<ICsvCellContext>(undefined);

export const showTalkContext = React.createContext<IShowTalk>(undefined);

export const invokeContext = React.createContext<IInvoke>(undefined);
