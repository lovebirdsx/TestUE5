/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import {
    cameraBindModeConfig,
    IPlayCustomSequence,
    IPlayMovie,
    IPlaySequenceData,
} from '../../../../Common/Interface/IAction';
import {
    createAssetScheme,
    createBooleanScheme,
    createEnumScheme,
    createObjectScheme,
    createScheme,
    createStringScheme,
} from '../../Type';
import { customSeqIdScheme } from '../Csv/CsvCell';

const DEFAULT_SEQUENCEDATA_PATH = '/Game/Test/CustomSequence/Sequence1.Sequence1';

export const seqDataScheme = createAssetScheme({
    Name: 'SeqData',
    CreateDefault: () => DEFAULT_SEQUENCEDATA_PATH,
    SearchPath: '/Game/Test/CustomSequence',
    ClassPath: 'CustomSequence_C',
});

export const playSequenceDataScheme = createObjectScheme<IPlaySequenceData>({
    CnName: '播放SequenceData',
    Name: 'PlaySequenceData',
    Fields: {
        Path: seqDataScheme,
        ResetCamera: createBooleanScheme({
            Tip: 'Sequence播放完毕之后, 是否重置镜头',
            ShowName: false,
            Optional: true,
        }),
    },
    Scheduled: true,
    Tip: '播放SequenceData',
});

export const whoIdsScheme = createScheme<number[]>({
    Name: 'WhoIds',
    Tip: '镜头绑定的对象',
    CreateDefault: () => [],
});

export const playCustomSequenceScheme = createObjectScheme<IPlayCustomSequence>({
    CnName: '播放自定义Sequence',
    Name: 'PlayCustomSequence',
    Fields: {
        CustomSeqId: customSeqIdScheme,
        WhoIds: whoIdsScheme,
        ResetCamera: createBooleanScheme({
            Tip: 'Sequence播放完毕之后, 是否重置镜头',
            ShowName: false,
            Optional: true,
        }),
    },
    Scheduled: true,
    Tip: '播放自定义Sequence',
});

export const cameraBindModeScheme = createEnumScheme({
    Name: 'CameraBindMode',
    Config: cameraBindModeConfig,
});

export const playMovieScheme = createObjectScheme<IPlayMovie>({
    CnName: '播放视频',
    Name: 'PlayMovieScheme',
    Fields: {
        VideoName: createStringScheme({
            Tip: '播放视频名称, 是否重置镜头',
            ShowName: false,
            Optional: true,
            CreateDefault: () => '',
        }),
    },
    Scheduled: true,
    Tip: '播放视频',
});
