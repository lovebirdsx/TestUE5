"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityView = void 0;
/* eslint-disable spellcheck/spell-checker */
const immer_1 = require("immer");
const React = require("react");
const react_umg_1 = require("react-umg");
const Util_1 = require("../../Common/Util");
const Public_1 = require("../../Game/Scheme/Entity/Public");
const CommonComponent_1 = require("../Common/BaseComponent/CommonComponent");
const LevelEditorUtil_1 = require("../Common/LevelEditorUtil");
const Public_2 = require("../Common/SchemeComponent/Public");
const ComponentsState_1 = require("./ComponentsState");
class EntityView extends React.Component {
    OnClickBtnNav = () => {
        LevelEditorUtil_1.default.SelectActor(this.props.Entity);
        LevelEditorUtil_1.default.FocusSelected();
    };
    OnClickBtnFocusBlueprint = () => {
        LevelEditorUtil_1.default.FocusOnSelectedBlueprint(this.props.Entity);
    };
    RenderPrefixElement() {
        const entity = this.props.Entity;
        const scheme = Public_1.entitySchemeRegistry.GetSchemeByEntity(entity);
        return (React.createElement(react_umg_1.HorizontalBox, null,
            React.createElement(CommonComponent_1.Text, { Text: scheme.Name }),
            React.createElement(CommonComponent_1.Btn, { Text: '◉', OnClick: this.OnClickBtnNav, Tip: '在场景中选中对应的Entity' }),
            React.createElement(CommonComponent_1.Btn, { Text: '⊙', OnClick: this.OnClickBtnFocusBlueprint, Tip: '浏览到Entity蓝图所在位置' })));
    }
    FixGuid = () => {
        const newPureData = (0, immer_1.default)(this.props.PureData, (draft) => {
            draft.Guid = (0, Util_1.genGuid)();
        });
        this.props.OnModify(newPureData, 'normal');
    };
    RenderGuid() {
        const guid = this.props.PureData.Guid;
        if (guid) {
            return React.createElement(CommonComponent_1.Text, { Text: `Guid: ${guid}` });
        }
        return React.createElement(CommonComponent_1.Btn, { Color: "#FF0000 red", Text: '修复Guid', OnClick: this.FixGuid });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const props = this.props;
        const entity = props.Entity;
        const pureData = props.PureData;
        const scheme = Public_1.entitySchemeRegistry.GetSchemeByEntity(entity);
        // pureData中ComponentsStateJson不是字符串,而是解析之后的数据
        const componentsState = pureData.ComponentsStateJson;
        const componentClassObjs = Public_1.entitySchemeRegistry.GetComponentClasses(entity);
        return (React.createElement(react_umg_1.VerticalBox, null,
            React.createElement(react_umg_1.VerticalBox, null,
                React.createElement(CommonComponent_1.H3, { Text: 'Entity' }),
                this.RenderGuid()),
            React.createElement(Public_2.Obj, { PrefixElement: this.RenderPrefixElement(), Value: pureData, Scheme: scheme, OnModify: props.OnModify }),
            React.createElement(CommonComponent_1.H3, { Text: 'Components' }),
            React.createElement(ComponentsState_1.ComponentsState, { Value: componentsState, ClassObjs: componentClassObjs, OnModify: (data, type) => {
                    const newPureData = (0, immer_1.default)(pureData, (draft) => {
                        draft.ComponentsStateJson = data;
                    });
                    props.OnModify(newPureData, type);
                } })));
    }
}
exports.EntityView = EntityView;
//# sourceMappingURL=EntityView.js.map