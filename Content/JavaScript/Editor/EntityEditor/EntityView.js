"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityView = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const CommonComponent_1 = require("../Common/Component/CommonComponent");
const Obj_1 = require("../Common/Component/Obj");
const LevelEditor_1 = require("../Common/LevelEditor");
const Index_1 = require("../Common/Scheme/Entity/Index");
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
        const scheme = Index_1.entityScheme.GetSchemeByUeObj(entity);
        return (React.createElement(Obj_1.Obj, { PrefixElement: this.RenderPrefixElement(), Value: pureData, Type: scheme, OnModify: props.OnModify }));
    }
}
exports.EntityView = EntityView;
//# sourceMappingURL=EntityView.js.map