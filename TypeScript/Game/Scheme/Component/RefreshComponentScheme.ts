/* eslint-disable spellcheck/spell-checker */
import {
    createBooleanScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
} from '../../../Common/Type';
import { EntityTemplateOp } from '../../Common/Operations/EntityTemplate';
import { IRefreshSingle, ITempleGuid } from '../../Component/RefreshComponent';
import { createComponentScheme } from './ComponentRegistry';

export const templeGuidScheme = createObjectScheme<ITempleGuid>({
    Fields: {
        TempleGuid: createStringScheme({
            CnName: '创建模板',
            NewLine: true,
            ShowName: true,
            CreateDefault: () => {
                return EntityTemplateOp.GenDefaultGuid();
            },
        }),
    },
    NewLine: true,
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
