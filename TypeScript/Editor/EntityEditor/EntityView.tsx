import * as React from 'react';

import TsEntity from '../../Game/Entity/TsEntity';
import { SlotText } from '../Common/Component/CommonComponent';
import { Obj } from '../Common/Component/Obj';
import { entityScheme } from '../Common/Scheme/Entity/Index';

export interface IEntityViewProps {
    Entity: TsEntity;
    PureData: Record<string, unknown>;
    OnModify: (data: Record<string, unknown>) => void;
}

export class EntityView extends React.Component<IEntityViewProps> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        const entity = props.Entity;
        const pureData = props.PureData;
        const scheme = entityScheme.GetSchemeByUeObj(entity);
        return (
            <Obj
                PrefixElement={<SlotText Text={entity.GetName()} />}
                Value={pureData}
                Type={scheme}
                OnModify={props.OnModify}
            />
        );
    }
}
