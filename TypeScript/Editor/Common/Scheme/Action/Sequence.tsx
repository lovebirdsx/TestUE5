/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import { csvOp } from '../../../../Common/CsvOp';
import {
    createAssetScheme,
    createEnumScheme,
    createObjectScheme,
    createScheme,
    IProps,
    Scheme,
} from '../../../../Common/Type';
import { csvRegistry, ECsvName } from '../../../../Game/Common/CsvConfig/CsvRegistry';
import { TalkerListOp } from '../../../../Game/Common/Operations/TalkerList';
import {
    cameraBindModeConfig,
    IPlayCustomSequence,
    IPlaySequenceData,
    TCameraBindMode,
} from '../../../../Game/Flow/Action';
import { List } from '../../BaseComponent/CommonComponent';
import { customSeqIdScheme } from '../Csv/CsvCell';

const DEFAULT_SEQUENCEDATA_PATH = '/Game/Test/CustomSequence/Sequence1.Sequence1';

export const seqDataScheme = createAssetScheme({
    CreateDefault: () => DEFAULT_SEQUENCEDATA_PATH,
    SearchPath: 'Test/CustomSequence',
    ClassPath: `Blueprint'/Game/Test/CustomSequence/CustomSequence.CustomSequence'`,
});

export const playSequenceDataScheme = createObjectScheme<IPlaySequenceData>(
    {
        Path: seqDataScheme,
    },
    {
        Scheduled: true,
        Tip: '播放SequenceData',
    },
);

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

const whoIdsScheme = createScheme({
    Tip: '镜头绑定的对象',
    CreateDefault: () => [],
    Render: (props: IProps): JSX.Element => {
        const ownerActionr = props.Owner as IPlayCustomSequence;
        const whoIds = ownerActionr.WhoIds;
        const customSeqId = ownerActionr.CustomSeqId;
        const csv = csvRegistry.Load(ECsvName.CustomSeq);
        const cameraBindType = csvOp.GetValue(
            csv,
            'Id',
            customSeqId.toString(),
            'BinderType',
        ) as TCameraBindMode;
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
    },
});

export const playCustomSequenceScheme = createObjectScheme<IPlayCustomSequence>(
    {
        CustomSeqId: customSeqIdScheme,
        WhoIds: whoIdsScheme as Scheme<number[]>,
    },
    {
        Scheduled: true,
        Tip: '播放自定义Sequence',
    },
);

export const cameraBindModeScheme = createEnumScheme(cameraBindModeConfig);
