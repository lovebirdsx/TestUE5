/* eslint-disable spellcheck/spell-checker */
import { createBooleanScheme, createIntScheme } from '../../../Common/Type';
import { IRefreshSingle } from '../../Component/RefreshComponent';
import { templateGuidScheme } from '../Action/Spawn';
import { createComponentScheme } from './ComponentRegistry';

export const refreshSingleComponentScheme = createComponentScheme<IRefreshSingle>({
    Actions: [],
    Fields: {
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
        TemplateGuid: templateGuidScheme,
    },
    NewLine: true,
});
