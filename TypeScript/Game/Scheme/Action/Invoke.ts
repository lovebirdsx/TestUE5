/* eslint-disable spellcheck/spell-checker */
import { createObjectScheme, createStringScheme, EActionFilter } from '../../../Common/Type';
import { IActionInfo, IInvoke } from '../../Flow/Action';
import { createActionScheme } from './Action';
import { moveToPosScheme } from './Move';

export const entityIdScheme = createStringScheme({
    CnName: '目标',
    RenderType: 'entityId',
    ShowName: true,
});

export const invokeScheme = createObjectScheme<IInvoke>({
    CnName: '调用方法',
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
