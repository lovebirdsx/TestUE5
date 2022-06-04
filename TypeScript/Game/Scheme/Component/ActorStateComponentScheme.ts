/* eslint-disable spellcheck/spell-checker */
import { createEnumScheme } from '../../../Common/Type';
import { actorStateConfig } from '../../Interface/Action';
import { IActorStateComponent } from '../../Interface/Component';
import { createComponentScheme } from './ComponentRegistry';

export const actorStateComponentScheme = createComponentScheme<IActorStateComponent>({
    Actions: ['ChangeActorState'],
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
