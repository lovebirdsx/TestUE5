/* eslint-disable spellcheck/spell-checker */
import {
    cameraModeConfig,
    flowBoolOptionConfig,
    ISetCameraMode,
    ISetFlowBoolOption,
    ISetPlotMode,
    plotModeConfig,
} from '../../../../Common/Interface/IAction';
import { booleanHideNameScheme, createEnumScheme, createObjectScheme } from '../../Type';

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
    Tip: '设定剧情模式,默认为D级演出',
});
