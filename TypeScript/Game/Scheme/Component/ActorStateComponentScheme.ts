/* eslint-disable spellcheck/spell-checker */
import { createEnumScheme, createObjectSchemeForComponent } from '../../../Common/Type';
import { actorStateConfig } from '../../Flow/Action';
import { IActorStateComponent } from '../../Interface';

export const actorStateComponentScheme = createObjectSchemeForComponent<IActorStateComponent>({
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
