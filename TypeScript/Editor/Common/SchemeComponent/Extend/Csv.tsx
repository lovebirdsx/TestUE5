/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { TCsvCellType } from '../../../../Game/Common/CsvConfig/CsvLoader';
import { TCsvValueType } from '../../../../Game/Interface/IAction';
import { getCsvCellSchemeByType } from '../../Scheme/Csv/CsvCell';
import { IProps } from '../../Type';
import { Any } from '../Basic/Any';
import { csvCellContext, ICsvCellContext } from '../Context';

export function RenderCsvFollowCell(props: IProps<TCsvValueType>): JSX.Element {
    return (
        <csvCellContext.Consumer>
            {(ctx: ICsvCellContext): React.ReactNode => {
                const csv = ctx.Csv;
                const prevCellName = csv.FiledTypes[ctx.ColId - 1].Name;
                const prevCellvalue = ctx.Csv.Rows[ctx.RowId][prevCellName] as TCsvCellType;
                const scheme = getCsvCellSchemeByType(prevCellvalue);
                return <Any {...props} Scheme={scheme} />;
            }}
        </csvCellContext.Consumer>
    );
}
