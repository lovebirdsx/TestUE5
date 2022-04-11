"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityView = void 0;
const React = require("react");
const CommonComponent_1 = require("../Common/Component/CommonComponent");
const Obj_1 = require("../Common/Component/Obj");
const Index_1 = require("../Common/Scheme/Entity/Index");
class EntityView extends React.Component {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        const props = this.props;
        const entity = props.Entity;
        const pureData = props.PureData;
        const scheme = Index_1.entityScheme.GetSchemeByUeObj(entity);
        return (React.createElement(Obj_1.Obj, { PrefixElement: React.createElement(CommonComponent_1.SlotText, { Text: entity.GetName() }), Value: pureData, Type: scheme, OnModify: props.OnModify }));
    }
}
exports.EntityView = EntityView;
//# sourceMappingURL=EntityView.js.map