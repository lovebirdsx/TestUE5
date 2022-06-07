/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { Vector } from 'ue';

import { IVectorInfo } from '../../../../Common/Interface';
import { IProps } from '../../../../Common/Type';
import { EditorBox } from '../../BaseComponent/CommonComponent';

export class VectorScheme extends React.Component<IProps<IVectorInfo>> {
    private readonly OnModifyX = (text: string): void => {
        const newPos = Object.assign({}, this.props.Value);
        newPos.X = parseFloat(text);
        this.SetVector(new Vector(newPos.X, newPos.Y, newPos.Z));
    };

    private readonly OnModifyY = (text: string): void => {
        const newPos = Object.assign({}, this.props.Value);
        newPos.Y = parseFloat(text);
        this.SetVector(new Vector(newPos.X, newPos.Y, newPos.Z));
    };

    private readonly OnModifyZ = (text: string): void => {
        const newPos = Object.assign({}, this.props.Value);
        newPos.Z = parseFloat(text);
        this.SetVector(new Vector(newPos.X, newPos.Y, newPos.Z));
    };

    private SetVector(vec: Vector): void {
        const pos: IVectorInfo = { X: vec.X, Y: vec.Y, Z: vec.Z };
        this.props.OnModify(pos, 'normal');
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const pos = this.props.Value;
        return (
            <HorizontalBox>
                {this.props.PrefixElement}
                <EditorBox Text={pos.X.toString()} OnChange={this.OnModifyX} Tip={'X'} />
                <EditorBox Text={pos.Y.toString()} OnChange={this.OnModifyY} Tip={'Y'} />
                <EditorBox Text={pos.Z.toString()} OnChange={this.OnModifyZ} Tip={'Z'} />
            </HorizontalBox>
        );
    }
}
