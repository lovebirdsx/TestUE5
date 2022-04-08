/* eslint-disable spellcheck/spell-checker */
import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { EditorAssetLibrary, Object, Struct } from 'ue';

import { assetListCache } from '../Common/AssetListCache';
import { AssetSelector, IAssetSelectorProps } from '../Common/Component/AssetSelector';
import { Btn } from '../Common/Component/CommonComponent';
import { log } from '../Common/Log';

export class TestAssetSelector extends React.Component<unknown, IAssetSelectorProps> {
    public constructor(props: unknown) {
        super(props);
        this.state = {
            ClassType: `Blueprint'/Game/Aki/Sequence/Manager/BP_SequenceData.BP_SequenceData'`,
            Path: 'Aki/Sequence',
            SelectedObjectPath:
                '/Game/Aki/Sequence/Task_Seq/Area_ZD/MainTask/Main_ZD_0001/Base/Main_ZD_0001_001.Main_ZD_0001_001',
            OnObjectPathChanged: this.OnObjectPathChanged,
        };
    }

    private readonly OnObjectPathChanged = (path: string): void => {
        this.setState({
            SelectedObjectPath: path,
        });
    };

    private readonly OnClickAssetListCache = (): void => {
        assetListCache.Info();
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
                <Btn Text={'AssetListCache'} OnClick={this.OnClickAssetListCache} />
                <Btn Text={'LoadClass'} OnClick={this.TestLoadClass} />
            </HorizontalBox>
        );
    }
}
