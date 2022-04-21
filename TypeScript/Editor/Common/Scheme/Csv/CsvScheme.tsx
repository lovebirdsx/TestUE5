/* eslint-disable spellcheck/spell-checker */
import { ECsvCellRenderType, ICsvMeta } from '../../../../Common/CsvLoader';
import {
    booleanScheme,
    floatScheme,
    intScheme,
    Scheme,
    stringScheme,
} from '../../../../Common/Type';
import { cameraBindModeScheme, seqDataScheme } from '../Action/Sequence';
import { csvCellTypeScheme, csvFollowCellScheme } from './CsvCell';

const csvSchemaMap2: { [key in ECsvCellRenderType]: Scheme } = {
    [ECsvCellRenderType.String]: stringScheme,
    [ECsvCellRenderType.Int]: intScheme,
    [ECsvCellRenderType.Float]: floatScheme,
    [ECsvCellRenderType.Boolean]: booleanScheme,
    [ECsvCellRenderType.CameraBinderMode]: cameraBindModeScheme,
    [ECsvCellRenderType.CellType]: csvCellTypeScheme,
    [ECsvCellRenderType.FollowCell]: csvFollowCellScheme,
    [ECsvCellRenderType.SequenceData]: seqDataScheme,
};

/* eslint-disable spellcheck/spell-checker */
class CsvScheme {
    public GetSchme(meta: ICsvMeta): Scheme {
        return csvSchemaMap2[meta.RenderType];
    }
}

export const csvScheme = new CsvScheme();
