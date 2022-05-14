/* eslint-disable spellcheck/spell-checker */
import { EditorLevelLibrary } from 'ue';

import { createObjectScheme, createStringScheme, EActionFilter } from '../../../Common/Type';
import { LevelUtil } from '../../Common/LevelUtil';
import { IActionInfo, IInvoke } from '../../Flow/Action';
import { createActionScheme } from './Action';
import { moveToPosScheme } from './Move';

export const entityIdScheme = createStringScheme({
    CnName: '目标',
    RenderType: 'entityId',
    CreateDefault: () => {
        // 本来Game是不可以访问Editor模块的代码的
        // 但是此处为了确保EntityId的合法, 必须要这样处理
        const world = EditorLevelLibrary.GetEditorWorld();
        const entities = LevelUtil.GetAllEntities(world);
        return entities.length > 0 ? entities[0].Guid : 'empty';
    },
    ShowName: true,
});

export const invokeScheme = createObjectScheme<IInvoke>({
    CnName: '调用方法',
    Tip: '让选定实体执行相关动作',
    Fields: {
        Who: entityIdScheme,
        ActionInfo: createActionScheme({
            Name: 'InvokeAction',
            Filter: EActionFilter.Invoke,
            CreateDefault(): IActionInfo {
                const moveToPos = moveToPosScheme.CreateDefault();
                return {
                    Name: 'MoveToPos',
                    Params: moveToPos,
                };
            },
            NewLine: true,
        }),
    },
});

export const destroyScheme = createObjectScheme<Record<string, undefined>>({
    Name: 'Destroy',
    CnName: '销毁',
    Filters: [EActionFilter.Invoke, EActionFilter.Trigger, EActionFilter.FlowList],
    Tip: '销毁对象',
});
