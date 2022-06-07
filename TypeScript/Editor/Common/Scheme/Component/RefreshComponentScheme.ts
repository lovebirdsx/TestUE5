/* eslint-disable spellcheck/spell-checker */
import {
    createArrayScheme,
    createBooleanScheme,
    createIntScheme,
    createObjectScheme,
} from '../../../../Common/Type';
import { EntityTemplateOp } from '../../../../Game/Common/Operations/EntityTemplate';
import {
    ICylinder,
    IRefreshGroup,
    IRefreshSingleComponent,
} from '../../../../Game/Interface/Component';
import { entityIdScheme } from '../Action/Invoke';
import { posScheme } from '../Action/Move';
import { createComponentScheme } from './ComponentRegistry';

export const templeGuidScheme = createIntScheme({
    CnName: '创建模板',
    NewLine: true,
    ShowName: true,
    CreateDefault: () => {
        return EntityTemplateOp.GenDefaultId();
    },
});

export const refreshSingleComponentScheme = createComponentScheme<IRefreshSingleComponent>({
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

const randomPointScheme = createObjectScheme<ICylinder>({
    CnName: '是否使用随机位置',
    Fields: {
        IsUse: createBooleanScheme({
            CnName: '是否使用随机位置？',
            CreateDefault: () => false,
            ShowName: true,
        }),
        Radius: createIntScheme({
            CnName: '半径',
            ShowName: true,
            NewLine: true,
        }),
        Height: createIntScheme({
            CnName: '高',
            ShowName: true,
            NewLine: true,
        }),
        CylinderPos: posScheme,
    },
    NewLine: true,
});

export const refreshEntityComponentScheme = createComponentScheme<IRefreshGroup>({
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
        EntityIdList: createArrayScheme({
            CnName: '实体列表',
            ShowName: true,
            NewLine: true,
            Element: entityIdScheme,
        }),
        IsUesCylinder: randomPointScheme,
    },
    NewLine: true,
});
