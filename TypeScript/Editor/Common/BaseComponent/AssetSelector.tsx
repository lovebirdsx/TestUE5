import * as React from 'react';
import { HorizontalBox } from 'react-umg';
import { BuiltinString, EditorAssetLibrary, EditorUtilityLibrary } from 'ue';

import { toUeArray } from '../../../Common/UeHelper';
import { assetListCache, IAsset } from '../AssetListCache';
import { Btn } from './CommonComponent';
import { FilterableList } from './FilterableList';

export interface IAssetSelectorProps {
    Path: string;
    ClassType: string;
    SelectedObjectPath: string;
    OnObjectPathChanged: (path: string) => void;
}

export class AssetSelector extends React.Component<IAssetSelectorProps> {
    private CachedNames: string[];

    private readonly CachedPath: string;

    private readonly CachedClassType: string;

    private get SelectedName(): string {
        const props = this.props;
        const assets = assetListCache.LoadAssets(props.Path, props.ClassType);
        const selected = assets.find(
            (assetData: IAsset) => assetData.Path === props.SelectedObjectPath,
        );
        return selected ? selected.Name : '';
    }

    private readonly OnSelectChanged = (name: string): void => {
        const props = this.props;
        const assets = assetListCache.LoadAssets(props.Path, props.ClassType);
        const selected = assets.find((assetData: IAsset) => assetData.Name === name);
        if (selected) {
            this.props.OnObjectPathChanged(selected.Path);
        }
    };

    private readonly OnClickBtnNav = (): void => {
        EditorAssetLibrary.SyncBrowserToObjects(
            toUeArray([this.props.SelectedObjectPath], BuiltinString),
        );
    };

    private readonly OnClickBtnAssign = (): void => {
        const assets = EditorUtilityLibrary.GetSelectedAssetData();
        if (assets.Num() <= 0) {
            return;
        }

        const asset = assets.Get(0);
        this.OnSelectChanged(asset.AssetName);
    };

    private GetNames(path: string, classType: string): string[] {
        if (this.CachedPath === path && this.CachedClassType === classType) {
            return this.CachedNames;
        }

        this.CachedNames = [];
        const assets = assetListCache.LoadAssets(path, classType);
        assets.forEach((asset: IAsset) => this.CachedNames.push(asset.Name));
        return this.CachedNames;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public render(): JSX.Element {
        const props = this.props;
        return (
            <HorizontalBox>
                <FilterableList
                    Items={this.GetNames(props.Path, props.ClassType)}
                    Selected={this.SelectedName}
                    OnSelectChanged={this.OnSelectChanged}
                    Tip={props.SelectedObjectPath}
                />
                <Btn
                    Text={'⇦'}
                    OnClick={this.OnClickBtnAssign}
                    Tip={'以内容浏览器中选中资源进行赋值'}
                />
                <Btn Text={'⊙'} OnClick={this.OnClickBtnNav} Tip={'在内容浏览器中显示'} />
            </HorizontalBox>
        );
    }
}
