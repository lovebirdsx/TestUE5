/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import {
    createAssetScheme,
    createEnumScheme,
    createObjectScheme,
    createScheme,
} from '../../../../Common/Type';
import {
    cameraBindModeConfig,
    IPlayCustomSequence,
    IPlaySequenceData,
} from '../../../../Game/Flow/Action';
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

export const whoIdsScheme = createScheme<number[]>({
    Tip: '镜头绑定的对象',
    CreateDefault: () => [],
});

export const playCustomSequenceScheme = createObjectScheme<IPlayCustomSequence>(
    {
        CustomSeqId: customSeqIdScheme,
        WhoIds: whoIdsScheme,
    },
    {
        Scheduled: true,
        Tip: '播放自定义Sequence',
    },
);

export const cameraBindModeScheme = createEnumScheme(cameraBindModeConfig);
