/* eslint-disable spellcheck/spell-checker */
import { createBooleanScheme, createIntScheme, createStringScheme } from '../../../Common/Type';
import { EntityTemplateOp } from '../../Common/Operations/EntityTemplate';
import { IRefreshSingle } from '../../Component/RefreshComponent';
import { createComponentScheme } from './ComponentRegistry';

const templeGuidScheme = createStringScheme({
    CnName: '创建模板',
    RenderType: 'templateIdData',
    CreateDefault: () => {
        return EntityTemplateOp.GenDefaultGuid();
    },
    NewLine: true,
    ShowName: true,
});

export const refreshSingleComponentScheme = createComponentScheme<IRefreshSingle>({
    Actions: [],
    Fields: {
        TemplateGuid: templeGuidScheme,
        RefreshInterval: createIntScheme({
            CnName: '刷新间隔',
            ShowName: true,
            NewLine: true,
        }),
        MaxRefreshTimes: createIntScheme({
            CnName: '最多刷新次数',
            ShowName: true,
            NewLine: true,
        }),
        DelayRefresh: createBooleanScheme({
            CnName: '延时刷新？',
            ShowName: true,
            NewLine: true,
        }),
    },
    NewLine: true,
});
