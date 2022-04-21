/* eslint-disable spellcheck/spell-checker */
import {
    actionFilterExcept,
    booleanHideNameScheme,
    createObjectScheme,
    EActionFilter,
    EnumScheme,
} from '../../../../Common/Type';
import { getEnumNamesByConfig } from '../../../../Common/Util';
import {
    cameraModeConfig,
    flowBoolOptionConfig,
    ISetCameraMode,
    ISetFlowBoolOption,
    ISetPlotMode,
    plotModeConfig,
    TCameraMode,
    TFlowBoolOption,
    TPlotMode,
} from '../../../../Game/Flow/Action';

export class FlowBooleanOptionScheme extends EnumScheme<TFlowBoolOption> {
    public Config: Record<string, string> = flowBoolOptionConfig;

    public Names: string[] = getEnumNamesByConfig(flowBoolOptionConfig);
}

export const setFlowBoolOptionScheme = createObjectScheme<ISetFlowBoolOption>(
    {
        Option: new FlowBooleanOptionScheme(),
        Value: booleanHideNameScheme,
    },
    {
        Meta: {
            Tip: '设定和剧情播放相关的控制变量',
        },
        Filters: actionFilterExcept(EActionFilter.Trigger),
    },
);

export class CameraModeScheme extends EnumScheme<TCameraMode> {
    public Config: Record<string, string> = cameraModeConfig;

    public Names: string[] = getEnumNamesByConfig(cameraModeConfig);
}

export const setCameraModeScheme = createObjectScheme<ISetCameraMode>(
    {
        Mode: new CameraModeScheme(),
    },
    {
        Meta: {
            Tip: '设定镜头模式',
        },
    },
);

export class PlotModeScheme extends EnumScheme<TPlotMode> {
    public Config: Record<string, string> = plotModeConfig;

    public Names: string[] = getEnumNamesByConfig(plotModeConfig);
}

export const setPlotModeScheme = createObjectScheme<ISetPlotMode>(
    {
        Mode: new PlotModeScheme(),
    },
    {
        Filters: [EActionFilter.FlowList],
        Meta: {
            Tip: '设定剧情模式,默认为D级演出',
        },
    },
);
