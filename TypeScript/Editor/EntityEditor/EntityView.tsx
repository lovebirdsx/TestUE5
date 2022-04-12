import * as React from 'react';
import { HorizontalBox } from 'react-umg';

import TsEntity from '../../Game/Entity/TsEntity';
import { Btn, SlotText } from '../Common/Component/CommonComponent';
import { Obj } from '../Common/Component/Obj';
import LevelEditor from '../Common/LevelEditor';
import { entityScheme } from '../Common/Scheme/Entity/Index';
import { TModifyType } from '../Common/Scheme/Type';

export interface IEntityViewProps {
    Entity: TsEntity;
    PureData: Record<string, unknown>;
    OnModify: (data: Record<string, unknown>, type: TModifyType) => void;
}

export class EntityView extends React.Component<IEntityViewProps> {
    private readonly OnClickBtnNav = (): void => {
        LevelEditor.SelectActor(this.props.Entity);
        LevelEditor.FocusSelected();
    };

    private RenderPrefixElement(): JSX.Element {
        const entity = this.props.Entity;
        return (
            <HorizontalBox>
                <SlotText Text={entity.GetName()} />
                <Btn Text={'⊙'} OnClick={this.OnClickBtnNav} Tip={'选中对应的Entity'} />
            </HorizontalBox>
        );
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        const entity = props.Entity;
        const pureData = props.PureData;
        const scheme = entityScheme.GetSchemeByUeObj(entity);
        return (
            <Obj
                PrefixElement={this.RenderPrefixElement()}
                Value={pureData}
                Type={scheme}
                OnModify={props.OnModify}
            />
        );
    }
}
