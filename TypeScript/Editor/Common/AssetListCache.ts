/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable spellcheck/spell-checker */
import { $ref } from 'puerts';
import { ARFilter, AssetData, AssetRegistryHelpers, NewArray } from 'ue';

import { toTsArray } from '../../Common/Misc/Util';
import { getSeconds } from './Util';

interface IItem {
    Time: number;
    Assets: AssetData[];
}

class AssetListCache {
    private readonly Cache: Map<string, IItem> = new Map();

    private GetAssetsImpl(searchPath: string, className: string): AssetData[] {
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

    /**
     * AssetData的字段示例
     *  AssetName Sequence1
     *  AssetClass CustomSequence_C
     *  ObjectPath /Game/Test/CustomSequence/Sequence1.Sequence1
     *  PackageName /Game/Test/CustomSequence/Sequence1
     *  PackagePath /Game/Test/CustomSequence
     */
    public GetAssets(searchPath: string, className: string): AssetData[] {
        const key = `${searchPath}##${className}`;
        const item = this.Cache.get(key);
        const now = getSeconds();
        if (item && now - item.Time < 30) {
            return item.Assets;
        }

        const datas = this.GetAssetsImpl(searchPath, className);
        this.Cache.set(key, { Time: now, Assets: datas });
        return datas;
    }
}

export const assetListCache = new AssetListCache();
