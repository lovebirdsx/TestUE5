"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityView = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const Interface_1 = require("../../Game/Entity/Interface");
const LevelEditor_1 = require("../Common/LevelEditor");
const CommonComponent_1 = require("../Common/ReactComponent/CommonComponent");
const Dynamic_1 = require("../Common/ReactComponent/Dynamic");
const Index_1 = require("../Common/Scheme/Entity/Index");
const ComponentsState_1 = require("./ComponentsState");
class EntityView extends React.Component {
    OnClickBtnNav = () => {
        LevelEditor_1.default.SelectActor(this.props.Entity);
        LevelEditor_1.default.FocusSelected();
    };
    RenderPrefixElement() {
        const entity = this.props.Entity;
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.SlotText, { Text: entity.GetName() }),
            React.createElement(CommonComponent_1.Btn, { Text: '⊙', OnClick: this.OnClickBtnNav, Tip: '选中对应的Entity' })));
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const props = this.props;
        const entity = props.Entity;
        const pureData = props.PureData;
        const scheme = Index_1.editorEntityRegistry.GetSchemeByEntity(entity);
        const componentsState = (0, Interface_1.parseComponentsState)(pureData.ComponentsStateJson);
        const componentClassObjs = Index_1.editorEntityRegistry.GetComponentClasses(entity);
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(Dynamic_1.Obj, { PrefixElement: this.RenderPrefixElement(), Value: pureData, Type: scheme, OnModify: props.OnModify }),
            React.createElement(ComponentsState_1.ComponentsState, { Value: componentsState, ClassObjs: componentClassObjs, OnModify: (data, type) => {
                    const newPureData = (0, immer_1.default)(pureData, (draft) => {
                        draft.ComponentsStateJson = JSON.stringify(data);
                    });
                    props.OnModify(newPureData, type);
                } })));
    }
}
exports.EntityView = EntityView;
//# sourceMappingURL=EntityView.js.map