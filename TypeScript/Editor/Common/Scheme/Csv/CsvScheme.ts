/* eslint-disable spellcheck/spell-checker */
import { TCsvCellRenderType } from '../../../../Common/CsvConfig/CsvLoader';
import { booleanScheme, floatScheme, intScheme, Scheme, stringScheme } from '../../Type';
import { entityBpScheme, entityTypeScheme } from '../Action/Entity';
import { cameraBindModeScheme, seqDataScheme } from '../Action/Sequence';
import { headIconScheme } from '../Action/Talker';
import { csvCellTypeScheme, csvEntityTemplateIdScheme, csvFollowCellScheme } from './CsvCell';

const csvSchemaMap: { [key in TCsvCellRenderType]: Scheme } = {
    String: stringScheme,
    Int: intScheme,
    Long: intScheme,
    Float: floatScheme,
    Boolean: booleanScheme,
    CameraBinderMode: cameraBindModeScheme,
    CellType: csvCellTypeScheme,
    FollowCell: csvFollowCellScheme,
    SequenceData: seqDataScheme,
    HeadIcon: headIconScheme,
    EntityBp: entityBpScheme,
    EntityTemplateId: csvEntityTemplateIdScheme,
    EntityType: entityTypeScheme,
};

/* eslint-disable spellcheck/spell-checker */
class CsvScheme {
    public GetSchme(renderType: TCsvCellRenderType): Scheme {
        return csvSchemaMap[renderType];
    }
}

export const csvScheme = new CsvScheme();
