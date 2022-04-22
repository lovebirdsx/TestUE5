/* eslint-disable spellcheck/spell-checker */
import {
    actionFilterExcept,
    booleanHideNameScheme,
    createEnumScheme,
    createObjectScheme,
    EActionFilter,
} from '../../../../Common/Type';
import {
    cameraModeConfig,
    flowBoolOptionConfig,
    ISetCameraMode,
    ISetFlowBoolOption,
    ISetPlotMode,
    plotModeConfig,
} from '../../../../Game/Flow/Action';

export const setFlowBoolOptionScheme = createObjectScheme<ISetFlowBoolOption>(
    {
        Option: createEnumScheme(flowBoolOptionConfig),
        Value: booleanHideNameScheme,
    },
    {
        Tip: '设定和剧情播放相关的控制变量',
        Filters: actionFilterExcept(EActionFilter.Trigger),
    },
);

export const setCameraModeScheme = createObjectScheme<ISetCameraMode>(
    {
        Mode: createEnumScheme(cameraModeConfig),
    },
    {
        Tip: '设定镜头模式',
    },
);

export const setPlotModeScheme = createObjectScheme<ISetPlotMode>(
    {
        Mode: createEnumScheme(plotModeConfig),
    },
    {
        Filters: [EActionFilter.FlowList],
        Tip: '设定剧情模式,默认为D级演出',
    },
);
