/* eslint-disable spellcheck/spell-checker */
import { TCsvCellRenderType } from '../../../../Common/CsvLoader';
import {
    booleanScheme,
    floatScheme,
    intScheme,
    Scheme,
    stringScheme,
} from '../../../../Common/Type';
import { cameraBindModeScheme, seqDataScheme } from '../Action/Sequence';
import { headIconScheme } from '../Action/Talker';
import { csvCellTypeScheme, csvFollowCellScheme } from './CsvCell';

const csvSchemaMap: { [key in TCsvCellRenderType]: Scheme } = {
    String: stringScheme,
    Int: intScheme,
    Float: floatScheme,
    Boolean: booleanScheme,
    CameraBinderMode: cameraBindModeScheme,
    CellType: csvCellTypeScheme,
    FollowCell: csvFollowCellScheme,
    SequenceData: seqDataScheme,
    HeadIcon: headIconScheme,
};

/* eslint-disable spellcheck/spell-checker */
class CsvScheme {
    public GetSchme(renderType: TCsvCellRenderType): Scheme {
        return csvSchemaMap[renderType];
    }
}

export const csvScheme = new CsvScheme();
