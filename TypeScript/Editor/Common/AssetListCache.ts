/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import { ARFilter, AssetData, AssetRegistryHelpers, EditorOperations, NewArray } from 'ue';

import { error, log } from '../../Common/Log';
import { loadClass, toTsArray } from '../../Common/Util';

export interface IAsset {
    AssetName: string;
    ObjectPath: string;
}

interface IItem {
    Path: string;
    ClassName: string;
    Assets: IAsset[];
}

class AssetListCache {
    private readonly Items: IItem[];

    public constructor() {
        this.Items = [];
    }

    public Info(): void {
        this.Items.forEach((item: IItem) => {
            log(`${item.Path} ${item.ClassName} ${item.Assets.length}`);
        });
        log(`Count = ${this.Items.length}`);
    }

    public Clear(): void {
        this.Items.splice(0, this.Items.length);
    }

    public LoadAssets(path: string, className: string): IAsset[] {
        const cachedItem = this.Items.find(
            (item: IItem) => item.Path === path && item.ClassName === className,
        );
        if (cachedItem) {
            return cachedItem.Assets;
        }

        const classObject = loadClass(className);
        if (className && !classObject) {
            error(`LoadBlueprintClass failed: ${className}`);
        }

        // 注意：此处不能直接使用UE的AssetData作为缓存对象
        // 因为UE的内存管理可能会在某个时间点释放对象，再次访问的时候，就会导致引擎奔溃
        const assetDatas = EditorOperations.LoadAssetDataFromPath(path, classObject);
        const assets: IAsset[] = [];
        for (let i = 0; i < assetDatas.Num(); i++) {
            const ad = assetDatas.Get(i);
            assets.push({
                AssetName: ad.AssetName,
                ObjectPath: ad.ObjectPath,
            });
        }

        this.Items.push({
            Path: path,
            ClassName: className,
            Assets: assets,
        });

        return assets;
    }

    /**
     * AssetData的字段示例
     *  AssetName Sequence1
     *  AssetClass CustomSequence_C
     *  ObjectPath /Game/Test/CustomSequence/Sequence1.Sequence1
     *  PackageName /Game/Test/CustomSequence/Sequence1
     *  PackagePath /Game/Test/CustomSequence
     */
    public GetAssets(searchPath: string, className: string): AssetData[] {
        const filter = new ARFilter();
        filter.ClassNames.Add(className);
        if (searchPath) {
            filter.PackagePaths.Add(searchPath);
        }
        filter.bRecursivePaths = true;
        const resultArray = NewArray(AssetData);
        const getOk = AssetRegistryHelpers.GetAssetRegistry().GetAssets(filter, $ref(resultArray));
        if (getOk) {
            return toTsArray(resultArray);
        }
        return [];
    }
}

export const assetListCache = new AssetListCache();
