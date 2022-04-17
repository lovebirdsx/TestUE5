"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestAssetSelector = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Log_1 = require("../../Common/Log");
const AssetListCache_1 = require("../Common/AssetListCache");
const AssetSelector_1 = require("../Common/ReactComponent/AssetSelector");
const CommonComponent_1 = require("../Common/ReactComponent/CommonComponent");
class TestAssetSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ClassType: `Blueprint'/Game/Aki/Sequence/Manager/BP_SequenceData.BP_SequenceData'`,
            Path: 'Aki/Sequence',
            SelectedObjectPath: '/Game/Aki/Sequence/Task_Seq/Area_ZD/MainTask/Main_ZD_0001/Base/Main_ZD_0001_001.Main_ZD_0001_001',
            OnObjectPathChanged: this.OnObjectPathChanged,
        };
    }
    OnObjectPathChanged = (path) => {
        this.setState({
            SelectedObjectPath: path,
        });
    };
    OnClickAssetListCache = () => {
        AssetListCache_1.assetListCache.Info();
    };
    TestLoadClass = () => {
        const classPath = `Blueprint'/Game/Aki/Sequence/Manager/BP_SequenceData.BP_SequenceData'`;
        (0, Log_1.log)(`${classPath}`);
        const obj = ue_1.Object.Load(classPath);
        (0, Log_1.log)(`Object = ${JSON.stringify(obj)} ${obj.GetName()}`);
        const structObj = ue_1.Struct.Load(classPath);
        (0, Log_1.log)(`Strcut = ${JSON.stringify(structObj)}`);
        const classObj = ue_1.Struct.Load(classPath);
        (0, Log_1.log)(`Class = ${JSON.stringify(classObj)}`);
        const blueprintClass = ue_1.EditorAssetLibrary.LoadBlueprintClass(classPath);
        (0, Log_1.log)(`BlueprintClass = ${JSON.stringify(blueprintClass)} ${blueprintClass.GetName()}`);
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(AssetSelector_1.AssetSelector, { ...this.state }),
            React.createElement(CommonComponent_1.Btn, { Text: 'AssetListCache', OnClick: this.OnClickAssetListCache }),
            React.createElement(CommonComponent_1.Btn, { Text: 'LoadClass', OnClick: this.TestLoadClass })));
    }
}
exports.TestAssetSelector = TestAssetSelector;
//# sourceMappingURL=TestAssetSelector.js.map