/* eslint-disable spellcheck/spell-checker */
import {
    actionFilterExcept,
    booleanHideNameScheme,
    createEnumScheme,
    createObjectScheme,
    EActionFilter,
} from '../../../Common/Type';
import {
    cameraModeConfig,
    flowBoolOptionConfig,
    ISetCameraMode,
    ISetFlowBoolOption,
    ISetPlotMode,
    plotModeConfig,
} from '../../Flow/Action';

export const setFlowBoolOptionScheme = createObjectScheme<ISetFlowBoolOption>({
    CnName: '设定剧情控制变量',
    Name: 'SetFlowBoolOption',
    Fields: {
        Option: createEnumScheme({
            Config: flowBoolOptionConfig,
            Name: 'FlowBoolOption',
        }),
        Value: booleanHideNameScheme,
    },
    Tip: '设定和剧情播放相关的控制变量',
    Filters: actionFilterExcept(EActionFilter.Trigger, EActionFilter.Invoke),
});

export const setCameraModeScheme = createObjectScheme<ISetCameraMode>({
    CnName: '设定相机模式',
    Name: 'SetCameraMode',
    Fields: {
        Mode: createEnumScheme({
            Config: cameraModeConfig,
            Name: 'CameraMode',
        }),
    },
    Tip: '设定镜头模式',
});

export const setPlotModeScheme = createObjectScheme<ISetPlotMode>({
    CnName: '设定剧情模式',
    Name: 'SetPlotMode',
    Fields: {
        Mode: createEnumScheme({
            Config: plotModeConfig,
            Name: 'PlotMode',
        }),
    },
    Filters: [EActionFilter.FlowList],
    Tip: '设定剧情模式,默认为D级演出',
});
