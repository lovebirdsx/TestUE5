/* eslint-disable spellcheck/spell-checker */
import {
    createArrayScheme,
    createBooleanScheme,
    createIntScheme,
    createObjectScheme,
    createStringScheme,
} from '../../../Common/Type';
import { EntityTemplateOp } from '../../Common/Operations/EntityTemplate';
import { IRefreshGroup, IRefreshSingle, ITempleGuid } from '../../Interface';
import { entityIdScheme } from '../Action/Invoke';
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

export const refreshEntityComponentScheme = createComponentScheme<IRefreshGroup>({
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
        EntityGuidList: createArrayScheme({
            CnName: '实体列表',
            ShowName: true,
            NewLine: true,
            Element: entityIdScheme,
        }),
    },
    NewLine: true,
});
