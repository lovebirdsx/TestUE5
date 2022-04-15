/* eslint-disable spellcheck/spell-checker */
import {
    cameraModeConfig,
    flowBoolOptionConfig,
    ISetCameraMode,
    ISetFlowBoolOption,
    ISetPlotMode,
    plotModeConfig,
} from '../../../../Game/Flow/Action';
import {
    booleanHideNameScheme,
    createEnumType,
    createObjectScheme,
    EObjectFilter,
    objectFilterExcept,
} from '../Type';

export const setFlowBoolOptionScheme = createObjectScheme<ISetFlowBoolOption>(
    {
        Option: createEnumType(flowBoolOptionConfig, {
            Meta: {
                HideName: true,
            },
        }),
        Value: booleanHideNameScheme,
    },
    {
        Meta: {
            Tip: '设定和剧情播放相关的控制变量',
        },
        Filters: objectFilterExcept(EObjectFilter.Trigger),
    },
);

export const setCameraModeScheme = createObjectScheme<ISetCameraMode>(
    {
        Mode: createEnumType(cameraModeConfig, {
            Meta: {
                HideName: true,
            },
        }),
    },
    {
        Meta: {
            Tip: '设定镜头模式',
        },
    },
);

export const setPlotModeScheme = createObjectScheme<ISetPlotMode>(
    {
        Mode: createEnumType(plotModeConfig, {
            Meta: {
                HideName: true,
            },
        }),
    },
    {
        Filters: [EObjectFilter.FlowList],
        Meta: {
            Tip: '设定剧情模式,默认为D级演出',
        },
    },
);
