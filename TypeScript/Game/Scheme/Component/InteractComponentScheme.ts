/* eslint-disable spellcheck/spell-checker */
import { createStringScheme, TObjectFields } from '../../../Common/Type';
import { IInteractiveComponent } from '../../Interface';
import { createComponentScheme } from './ComponentRegistry';

export const interactiveComponentFields: TObjectFields<IInteractiveComponent> = {
    Content: createStringScheme({
        CnName: `交互文本`,
        ShowName: true,
        NewLine: true,
        CreateDefault: () => '',
    }),
    Icon: createStringScheme({
        CnName: `交互类型图标`,
        ShowName: true,
        NewLine: true,
        CreateDefault: () => '',
    }),
};

// 因为scheme没有其他内容，所以写这里
export const npcComponentScheme = createComponentScheme<IInteractiveComponent>({
    Actions: [],
    Fields: {
        ...interactiveComponentFields,
    },
});

export const sphereComponentScheme = createComponentScheme<IInteractiveComponent>({
    Actions: [],
    Fields: {
        ...interactiveComponentFields,
    },
});
