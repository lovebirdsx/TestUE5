/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { csvRegistry, ECsvName } from '../../../../Game/Common/CsvConfig/CsvRegistry';
import { TalkerListOp } from '../../../../Game/Common/Operations/TalkerList';
import { IPlayCustomSequence, TCameraBindMode } from '../../../../Game/Interface/IAction';
import { List } from '../../BaseComponent/CommonComponent';
import { csvOp } from '../../CsvOp';
import { IProps } from '../../Type';

function getTalkerCountByCameraBindType(type: TCameraBindMode): number {
    switch (type) {
        case 'One':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'None':
            return 0;
        default:
            return 0;
    }
}

const DEFAULT_WHO_ID = 0;

export function RenderWhoIdsScheme(props: IProps<number[]>): JSX.Element {
    const ownerActionr = props.Owner as IPlayCustomSequence;
    const whoIds = ownerActionr.WhoIds;
    const customSeqId = ownerActionr.CustomSeqId;
    const csv = csvRegistry.Load(ECsvName.CustomSeq);
    const cameraBindType = csvOp.GetValue<TCameraBindMode>(
        csv,
        'Id',
        customSeqId.toString(),
        'BinderType',
    );
    const whoCount = getTalkerCountByCameraBindType(cameraBindType);
    const whoElements: JSX.Element[] = [];
    const talkers = TalkerListOp.Get().Talkers;
    for (let i = 0; i < whoCount; i++) {
        const whoId = i < whoIds.length ? whoIds[i] : DEFAULT_WHO_ID;
        const names = TalkerListOp.GetNames();
        const selectedTalker = talkers.find((e) => e.Id === whoId);
        whoElements.push(
            <List
                key={i}
                Items={names}
                Selected={selectedTalker ? selectedTalker.Name : ''}
                Tip={'绑定对象'}
                OnSelectChanged={(name: string): void => {
                    const who = talkers.find((e) => e.Name === name);
                    const result = whoIds.slice();
                    const selectWhoId = who ? who.Id : DEFAULT_WHO_ID;
                    while (result.length < whoCount) {
                        result.push(DEFAULT_WHO_ID);
                    }
                    result[i] = selectWhoId;
                    props.OnModify(result, 'normal');
                }}
            />,
        );
    }

    return <HorizontalBox>{whoElements}</HorizontalBox>;
}
