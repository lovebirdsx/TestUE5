/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import { ARFilter, AssetData, AssetRegistryHelpers, EditorOperations, NewArray } from 'ue';

import { error, log } from '../../Common/Log';
import { loadClass } from '../../Common/Util';

export interface IAsset {
    Name: string;
    Path: string;
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
                Name: ad.AssetName,
                Path: ad.ObjectPath,
            });
        }

        this.Items.push({
            Path: path,
            ClassName: className,
            Assets: assets,
        });

        return assets;
    }

    public FindAssets(path: string, className: string): IAsset[] {
        // 软获取，不需要加载资源进入内存
        const assetManage = AssetRegistryHelpers.GetAssetRegistry();
        const filter = new ARFilter();
        if (className) {
            filter.ClassNames.Add(className);
        }
        if (path) {
            filter.ObjectPaths.Add(path);
        }
        const resultArray = NewArray(AssetData);
        const result = assetManage.GetAssets(filter, $ref(resultArray));
        const assets: IAsset[] = [];
        if (result) {
            for (let i = 0; i < resultArray.Num(); i++) {
                const ad = resultArray.Get(i);
                assets.push({
                    Name: ad.AssetName,
                    Path: ad.ObjectPath,
                });
            }
        }
        return assets;
    }
}

export const assetListCache = new AssetListCache();
