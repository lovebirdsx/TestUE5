"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
const React = require("react");
const react_umg_1 = require("react-umg");
const CommonComponent_1 = require("./CommonComponent");
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { Error: null, ErrorInfo: null };
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    componentDidCatch(error, errorInfo) {
        this.setState({
            Error: error,
            ErrorInfo: errorInfo,
        });
    }
    Clear = () => {
        this.setState({
            Error: null,
            ErrorInfo: null,
        });
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    render() {
        if (this.state.ErrorInfo) {
            return (React.createElement(react_umg_1.VerticalBox, null,
                React.createElement(CommonComponent_1.Btn, { Text: 'Clear', OnClick: this.Clear, Color: "#FF8C00 dark orange", TextSize: 12 }),
                React.createElement(CommonComponent_1.H1, { Text: "Something went wrong." }),
                React.createElement(CommonComponent_1.H2, { Text: this.state.Error ? JSON.stringify(this.state.Error) : '' }),
                React.createElement(CommonComponent_1.H2, { Text: this.state.ErrorInfo.componentStack })));
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map