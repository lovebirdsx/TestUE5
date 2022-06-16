/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { EditorAssetLibrary, Object, Struct } from 'ue';

import { log } from '../../Common/Misc/Log';
import { AssetSelector, IAssetSelectorProps } from '../Common/BaseComponent/AssetSelector';
import { Btn } from '../Common/BaseComponent/CommonComponent';

export class TestAssetSelector extends React.Component<unknown, IAssetSelectorProps> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            ClassType: `/Game/Test/CustomSequence/CustomSequence.CustomSequence_C`,
            Path: 'Test/CustomSequence',
            SelectedObjectPath: '/Game/Test/CustomSequence/Sequence1.Sequence1',
            OnObjectPathChanged: this.OnObjectPathChanged,
        };
    }

    private readonly OnObjectPathChanged = (path: string): void => {
        this.setState({
            SelectedObjectPath: path,
        });
    };

    private readonly TestLoadClass = (): void => {
        const classPath = `Blueprint'/Game/Aki/Sequence/Manager/BP_SequenceData.BP_SequenceData'`;
        log(`${classPath}`);

        const obj = Object.Load(classPath);
        log(`Object = ${JSON.stringify(obj)} ${obj.GetName()}`);

        const structObj = Struct.Load(classPath);
        log(`Strcut = ${JSON.stringify(structObj)}`);

        const classObj = Struct.Load(classPath);
        log(`Class = ${JSON.stringify(classObj)}`);

        const blueprintClass = EditorAssetLibrary.LoadBlueprintClass(classPath);
        log(`BlueprintClass = ${JSON.stringify(blueprintClass)} ${blueprintClass.GetName()}`);
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        return (
            <HorizontalBox>
                <AssetSelector {...this.state} />
                <Btn Text={'LoadClass'} OnClick={this.TestLoadClass} />
            </HorizontalBox>
        );
    }
}
