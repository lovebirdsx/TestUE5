import produce from 'immer';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import {
    createAssetScheme,
    createEnumType,
    createObjectScheme,
    IAbstractType,
    IAnyProps,
} from '../../../../Common/Type';
import {
    cameraBindModeConfig,
    IPlayCustomSequence,
    IPlaySequenceData,
} from '../../../../Game/Flow/Action';
import { Any } from '../../ReactComponent/Dynamic/Index';
import { customSeqIdScheme } from '../Csv/CsvCell';

const DEFAULT_SEQUENCEDATA_PATH = '/Game/Test/CustomSequence/Sequence1.Sequence1';

export const seqDataScheme = createAssetScheme({
    CreateDefault: (container: unknown) => DEFAULT_SEQUENCEDATA_PATH,
    SearchPath: 'Test/CustomSequence',
    ClassPath: `Blueprint'/Game/Test/CustomSequence/CustomSequence.CustomSequence'`,
    Meta: {
        HideName: true,
    },
});

export const playSequenceDataScheme = createObjectScheme<IPlaySequenceData>(
    {
        Path: seqDataScheme,
    },
    {
        Scheduled: true,
        Meta: {
            Tip: '播放SequenceData',
        },
    },
);

function renderPlayCustomSequence(props: IAnyProps): JSX.Element {
    const action = props.Value as IPlayCustomSequence;

    return (
        <HorizontalBox>
            <Any
                Value={action.CustomSeqId}
                Type={customSeqIdScheme as IAbstractType<unknown>}
                OnModify={(newId, type): void => {
                    const newProps = produce(action, (draft) => {
                        draft.CustomSeqId = newId as number;
                    });
                    props.OnModify(newProps, type);
                }}
            />
        </HorizontalBox>
    );
}

export const playCustomSequenceScheme = createObjectScheme<IPlayCustomSequence>(
    {
        CustomSeqId: undefined,
        WhoIds: undefined,
    },
    {
        Scheduled: true,
        Meta: {
            Tip: '播放自定义Sequence',
        },
        Render: renderPlayCustomSequence,
    },
);

export const cameraBindModeScheme = createEnumType(cameraBindModeConfig, {
    Meta: {
        HideName: true,
    },
});
