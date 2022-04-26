import { $ref } from 'puerts';
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { Actor, EditorLevelLibrary, GameplayStatics, NewArray } from 'ue';

import { getUeClassByTsClass } from '../../Common/Class';
import { log, warn } from '../../Common/Log';
import TsEntity from '../../Game/Entity/TsEntity';
import { Btn } from '../Common/BaseComponent/CommonComponent';

export class TestMap extends React.Component {
    private readonly OnGetAllEntities = (): void => {
        const world = EditorLevelLibrary.GetEditorWorld();
        if (!world) {
            warn('No editor world exist');
            return;
        }

        const actors = NewArray(Actor);
        GameplayStatics.GetAllActorsOfClass(world, getUeClassByTsClass(TsEntity), $ref(actors));

        log(`TsEntity count = ${actors.Num()}`);
        for (let i = 0; i < actors.Num(); i++) {
            const actor = actors.Get(i);
            const status: string[] = [];
            status.push(`${i} ${actor.GetName()} bHidden=${actor.bHidden}`);
            status.push(`IsActorBeingDestroyed=${actor.IsActorBeingDestroyed()}`);
            log(status.join(' '));
        }
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <HorizontalBox>
                <Btn Text={'Get all entities'} OnClick={this.OnGetAllEntities} />
            </HorizontalBox>
        );
    }
}
