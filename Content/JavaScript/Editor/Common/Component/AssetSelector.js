"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetSelector = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const AssetListCache_1 = require("../AssetListCache");
const Common_1 = require("../Common");
const CommonComponent_1 = require("./CommonComponent");
const FilterableList_1 = require("./FilterableList");
class AssetSelector extends React.Component {
    CachedNames;
    CachedPath;
    CachedClassType;
    get SelectedName() {
        const props = this.props;
        const assets = AssetListCache_1.assetListCache.LoadAssets(props.Path, props.ClassType);
        const selected = assets.find((assetData) => assetData.Path === props.SelectedObjectPath);
        return selected ? selected.Name : '';
    }
    OnSelectChanged = (name) => {
        const props = this.props;
        const assets = AssetListCache_1.assetListCache.LoadAssets(props.Path, props.ClassType);
        const selected = assets.find((assetData) => assetData.Name === name);
        if (selected) {
            this.props.OnObjectPathChanged(selected.Path);
        }
    };
    OnClickBtnNav = () => {
        ue_1.EditorAssetLibrary.SyncBrowserToObjects((0, Common_1.toUeArray)([this.props.SelectedObjectPath], ue_1.BuiltinString));
    };
    OnClickBtnAssign = () => {
        const assets = ue_1.EditorUtilityLibrary.GetSelectedAssetData();
        if (assets.Num() <= 0) {
            return;
        }
        const asset = assets.Get(0);
        this.OnSelectChanged(asset.AssetName);
    };
    GetNames(path, classType) {
        if (this.CachedPath === path && this.CachedClassType === classType) {
            return this.CachedNames;
        }
        this.CachedNames = [];
        const assets = AssetListCache_1.assetListCache.LoadAssets(path, classType);
        assets.forEach((asset) => this.CachedNames.push(asset.Name));
        return this.CachedNames;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const props = this.props;
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(FilterableList_1.FilterableList, { Items: this.GetNames(props.Path, props.ClassType), Selected: this.SelectedName, OnSelectChanged: this.OnSelectChanged, Tip: props.SelectedObjectPath }),
            React.createElement(CommonComponent_1.Btn, { Text: '⇦', OnClick: this.OnClickBtnAssign, Tip: '以内容浏览器中选中资源进行赋值' }),
            React.createElement(CommonComponent_1.Btn, { Text: '⊙', OnClick: this.OnClickBtnNav, Tip: '在内容浏览器中显示' })));
    }
}
exports.AssetSelector = AssetSelector;
//# sourceMappingURL=AssetSelector.js.map