/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';

import { TCsvCellType } from '../../../../Common/CsvLoader';
import { IProps, TCsvValueType } from '../../../../Common/Type';
import { getCsvCellSchemeByType } from '../../../../Game/Scheme/Csv/CsvCell';
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
