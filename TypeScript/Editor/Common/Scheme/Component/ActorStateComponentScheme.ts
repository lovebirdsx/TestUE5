/* eslint-disable spellcheck/spell-checker */
import { createEnumScheme } from '../../../../Common/Type';
import { actorStateConfig } from '../../../../Game/Interface/Action';
import { IActorStateComponent } from '../../../../Game/Interface/Component';
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
