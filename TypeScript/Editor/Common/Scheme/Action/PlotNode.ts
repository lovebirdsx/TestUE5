/* eslint-disable spellcheck/spell-checker */
import {
    actionFilterExcept,
    booleanHideNameScheme,
    createObjectScheme,
    EActionFilter,
    EnumScheme,
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
        // fuck
        // Option: createEnumType(flowBoolOptionConfig, {
        //     Meta: {
        //         HideName: true,
        //     },
        // }),
        Option: new EnumScheme(flowBoolOptionConfig),
        Value: booleanHideNameScheme,
    },
    {
        Meta: {
            Tip: '设定和剧情播放相关的控制变量',
        },
        Filters: actionFilterExcept(EActionFilter.Trigger),
    },
);

export const setCameraModeScheme = createObjectScheme<ISetCameraMode>(
    {
        // fuck
        // Mode: createEnumType(cameraModeConfig, {
        //     Meta: {
        //         HideName: true,
        //     },
        // }),
        Mode: new EnumScheme(cameraModeConfig),
    },
    {
        Meta: {
            Tip: '设定镜头模式',
        },
    },
);

export const setPlotModeScheme = createObjectScheme<ISetPlotMode>(
    {
        // fuck
        // Mode: createEnumType(plotModeConfig, {
        //     Meta: {
        //         HideName: true,
        //     },
        // }),
        Mode: new EnumScheme(plotModeConfig),
    },
    {
        Filters: [EActionFilter.FlowList],
        Meta: {
            Tip: '设定剧情模式,默认为D级演出',
        },
    },
);
