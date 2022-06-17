/* eslint-disable spellcheck/spell-checker */
import { actorStateConfig } from '../../../../Common/Interface/IAction';
import { IActorStateComponent } from '../../../../Common/Interface/IComponent';
import { createEnumScheme } from '../../Type';
import { createComponentScheme } from './ComponentRegistry';

export const actorStateComponentScheme = createComponentScheme<IActorStateComponent>({
    Name: 'FlowComponent',
    Fields: {
        InitState: createEnumScheme({
            CnName: '初始状态',
            Config: actorStateConfig,
            NewLine: true,
            ShowName: true,
        }),
    },
    NewLine: true,
});
