"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetListCache = void 0;
/* eslint-disable spellcheck/spell-checker */
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
const Util_1 = require("../../Common/Util");
class AssetListCache {
    Items;
    constructor() {
        this.Items = [];
    }
    Info() {
        this.Items.forEach((item) => {
            (0, Log_1.log)(`${item.Path} ${item.ClassName} ${item.Assets.length}`);
        });
        (0, Log_1.log)(`Count = ${this.Items.length}`);
    }
    Clear() {
        this.Items.splice(0, this.Items.length);
    }
    LoadAssets(path, className) {
        const cachedItem = this.Items.find((item) => item.Path === path && item.ClassName === className);
        if (cachedItem) {
            return cachedItem.Assets;
        }
        const classObject = (0, Util_1.loadClass)(className);
        if (className && !classObject) {
            (0, Log_1.error)(`LoadBlueprintClass failed: ${className}`);
        }
        // 注意：此处不能直接使用UE的AssetData作为缓存对象
        // 因为UE的内存管理可能会在某个时间点释放对象，再次访问的时候，就会导致引擎奔溃
        const assetDatas = ue_1.EditorOperations.LoadAssetDataFromPath(path, classObject);
        const assets = [];
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
}
exports.assetListCache = new AssetListCache();
//# sourceMappingURL=AssetListCache.js.map