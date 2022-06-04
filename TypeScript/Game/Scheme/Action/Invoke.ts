/* eslint-disable spellcheck/spell-checker */
import { EditorLevelLibrary } from 'ue';

import { createObjectScheme, createStringScheme } from '../../../Common/Type';
import { LevelUtil } from '../../Common/LevelUtil';
import { IActionInfo, IInteract, IInvoke } from '../../Interface/Action';
import { createActionScheme } from './Action';
import { actionRegistry } from './ActionRegistry';
import { setPosScheme } from './Move';

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
    Check: (invoke: IInvoke, messages: string[]): number => {
        const actionScheme = actionRegistry.GetScheme(invoke.ActionInfo.Name);
        if (actionScheme.Scheduled) {
            messages.push(`Invoke [${invoke.ActionInfo.Name}]: 只能调用瞬发型动作`);
            return 1;
        }
        return 0;
    },
    Fields: {
        Who: entityIdScheme,
        ActionInfo: createActionScheme({
            Name: 'InvokeAction',
            CreateDefault(): IActionInfo {
                const setPos = setPosScheme.CreateDefault();
                return {
                    Name: 'SetPos',
                    Params: setPos,
                };
            },
            NewLine: true,
        }),
    },
});

export const destroyScheme = createObjectScheme<Record<string, undefined>>({
    Name: 'Destroy',
    CnName: '销毁',
    Fields: {},
    Tip: '销毁对象',
});

export const interactScheme = createObjectScheme<IInteract>({
    CnName: '触发交互',
    Tip: '让选定实体交互',
    Fields: {
        Who: createStringScheme({
            CnName: '触发者',
            RenderType: 'entityId',
            ShowName: true,
        }),
        Param: createStringScheme({
            CnName: '参数',
            RenderType: 'string',
            ShowName: true,
            NewLine: true,
        }),
    },
});
