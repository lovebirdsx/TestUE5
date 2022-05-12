/* eslint-disable spellcheck/spell-checker */
import { createEnumScheme, createObjectScheme } from '../../../Common/Type';
import { actorStateConfig } from '../../Flow/Action';
import { IActorStateComponent } from '../../Interface';

export const actorStateComponentScheme = createObjectScheme<IActorStateComponent>({
    Name: 'FlowComponent',
    Fields: {
        State: createEnumScheme({
            CnName: '初始状态',
            Config: actorStateConfig,
            NewLine: true,
            ShowName: true,
        }),
    },
    NewLine: true,
});
