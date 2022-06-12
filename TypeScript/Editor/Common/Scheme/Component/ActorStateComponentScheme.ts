/* eslint-disable spellcheck/spell-checker */
import { actorStateConfig } from '../../../../Game/Interface/IAction';
import { IActorStateComponent } from '../../../../Game/Interface/IComponent';
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
