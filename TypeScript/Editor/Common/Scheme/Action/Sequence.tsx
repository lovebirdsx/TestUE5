import { createAssetScheme, createEnumType, createObjectScheme } from '../../../../Common/Type';
import { cameraBindModeConfig, IPlaySequenceData } from '../../../../Game/Flow/Action';

const DEFAULT_SEQUENCEDATA_PATH =
    '/Game/Aki/Sequence/Task_Seq/Area_ZD/MainTask/Main_ZD_0001/Base/Main_ZD_0001_001.Main_ZD_0001_001';

export const seqDataScheme = createAssetScheme({
    CreateDefault: (container: unknown) => DEFAULT_SEQUENCEDATA_PATH,
    SearchPath: 'Aki/Sequence',
    ClassPath: `Blueprint'/Game/Aki/Sequence/Manager/BP_SequenceData.BP_SequenceData'`,
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

export const cameraBindModeScheme = createEnumType(cameraBindModeConfig, {
    Meta: {
        HideName: true,
    },
});
