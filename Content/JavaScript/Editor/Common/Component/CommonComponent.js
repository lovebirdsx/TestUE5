"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = exports.Fold = exports.Check = exports.EditorBox = exports.Btn = exports.H3 = exports.H2 = exports.H1 = exports.SlotText = exports.Text = exports.HEADING_COLOR = exports.DEFAULT_OUTLINE_COLOR = exports.DEFAULT_HOVER_COLOR = exports.DEFAULT_BACK_COLOR = exports.DEFAULT_LIST_BACK_COLOR = exports.DEFAULT_EDIT_TEXT_COLOR = exports.DEFAULT_TEXT_COLOR = exports.TAB_OFFSET = void 0;
/* eslint-disable spellcheck/spell-checker */
const React = require("react");
const react_umg_1 = require("react-umg");
const ue_1 = require("ue");
const Common_1 = require("../Common");
const Color_1 = require("./Color");
// export { List } from './ListView';
exports.TAB_OFFSET = 20;
const DEFAULT_FONT_SIZE = 10;
exports.DEFAULT_TEXT_COLOR = '#FFFFFF white';
exports.DEFAULT_EDIT_TEXT_COLOR = '#FFFFFF white';
const DEFAULT_EDIT_TEXT_WIDTH = 80;
// export const DEFAULT_LIST_BACK_COLOR: TColor = '#101010 very dark';
exports.DEFAULT_LIST_BACK_COLOR = '#0A0A0A very dark';
exports.DEFAULT_BACK_COLOR = '#383838 dark';
exports.DEFAULT_HOVER_COLOR = '#575757 hover';
exports.DEFAULT_OUTLINE_COLOR = '#000000 black';
function createSlateColor(color) {
    return {
        SpecifiedColor: (0, Color_1.formatColor)(color),
        ColorUseRule: ue_1.ESlateColorStylingMode.UseColor_Specified,
    };
}
const defaultPadding = {
    Left: 2.0,
    Top: 2.0,
    Right: 2.0,
    Bottom: 2.0,
};
const defaultTintBackColor = createSlateColor(exports.DEFAULT_BACK_COLOR);
const defaultTintHoverColor = createSlateColor(exports.DEFAULT_HOVER_COLOR);
const defaultTintTextColor = createSlateColor(exports.DEFAULT_TEXT_COLOR);
const defaultOutLineColor = createSlateColor(exports.DEFAULT_OUTLINE_COLOR);
const defaultOutlineSetting = {
    Width: 1,
    Color: defaultOutLineColor,
};
const defalutNormalBrush = {
    TintColor: defaultTintBackColor,
    OutlineSettings: defaultOutlineSetting,
};
const defalutHoverBrush = {
    TintColor: defaultTintHoverColor,
    OutlineSettings: defaultOutlineSetting,
};
const defaultButtonStyle = {
    Normal: defalutNormalBrush,
    Hovered: defalutHoverBrush,
    NormalPadding: defaultPadding,
    PressedPadding: defaultPadding,
};
const defalutSlot = {
    Padding: { Left: 2, Right: 2, Top: 2, Bottom: 2 },
};
const textSlot = {
    Padding: { Left: 0, Right: 0, Top: 3, Bottom: 0 },
};
const buttonTextSlot = {
    Padding: { Left: 2, Right: 2, Top: -1, Bottom: -1 },
};
const buttonSlot = {
    // 不使用默认的Align,从而可以让Button自适应文字的大小
    ...defalutSlot,
    HorizontalAlignment: ue_1.EHorizontalAlignment.HAlign_Fill,
};
const defaultListSlot = {
    // 不使用默认的Align,从而可以让Button自适应文字的大小
    ...defalutSlot,
    HorizontalAlignment: ue_1.EHorizontalAlignment.HAlign_Left,
};
const DEFAULT_LIST_FONT_SIZE = DEFAULT_FONT_SIZE;
const H3_SIZE = DEFAULT_FONT_SIZE + 2;
const H2_SIZE = H3_SIZE + 2;
const H1_SIZE = H2_SIZE + 2;
exports.HEADING_COLOR = '#1E90FF dodger blue';
// eslint-disable-next-line @typescript-eslint/naming-convention
function Text(props) {
    const color = (0, Color_1.formatColor)(props.Color || exports.DEFAULT_TEXT_COLOR);
    return (React.createElement(react_umg_1.TextBlock, { Text: props.Text, Font: { Size: props.Size || DEFAULT_FONT_SIZE }, ColorAndOpacity: { SpecifiedColor: color }, bIsEnabled: !props.Disabled, Slot: props.Slot || textSlot, ToolTipText: props.Tip }));
}
exports.Text = Text;
// eslint-disable-next-line @typescript-eslint/naming-convention
function SlotText(props) {
    return React.createElement(Text, { ...props, Color: exports.HEADING_COLOR });
}
exports.SlotText = SlotText;
// eslint-disable-next-line @typescript-eslint/naming-convention
function H1(props) {
    return React.createElement(Text, { ...props, Size: H1_SIZE, Color: exports.HEADING_COLOR });
}
exports.H1 = H1;
// eslint-disable-next-line @typescript-eslint/naming-convention
function H2(props) {
    return React.createElement(Text, { ...props, Size: H2_SIZE, Color: exports.HEADING_COLOR });
}
exports.H2 = H2;
// eslint-disable-next-line @typescript-eslint/naming-convention
function H3(props) {
    return React.createElement(Text, { ...props, Size: H3_SIZE, Color: exports.HEADING_COLOR });
}
exports.H3 = H3;
// eslint-disable-next-line @typescript-eslint/naming-convention
function Btn(props) {
    const backColor = (0, Color_1.formatColor)(props.BackColor || exports.DEFAULT_BACK_COLOR);
    const buttonElement = (React.createElement(react_umg_1.Button, { OnClicked: props.OnClick, BackgroundColor: backColor, WidgetStyle: defaultButtonStyle, bIsEnabled: !props.Disabled, Slot: props.Slot || buttonSlot, ToolTipText: props.Tip },
        React.createElement(Text, { Text: props.Text, Size: props.TextSize, Color: props.Color, Disabled: props.Disabled, Slot: buttonTextSlot })));
    if (props.Width) {
        return (React.createElement(react_umg_1.SizeBox, { bOverride_WidthOverride: true, WidthOverride: props.Width || DEFAULT_EDIT_TEXT_WIDTH }, buttonElement));
    }
    return buttonElement;
}
exports.Btn = Btn;
// 设定EditableTextBox的颜色无效,是unreal本身存在bug: https://issues.unrealengine.com/issue/UE-37829
// eslint-disable-next-line @typescript-eslint/naming-convention
function EditorBox(props) {
    const textColor = createSlateColor(props.Color || exports.DEFAULT_EDIT_TEXT_COLOR);
    return (React.createElement(react_umg_1.SizeBox, { bOverride_MinDesiredWidth: true, MinDesiredWidth: props.Width || DEFAULT_EDIT_TEXT_WIDTH },
        React.createElement(react_umg_1.EditableTextBox, { Text: props.Text, WidgetStyle: {
                Font: { Size: props.Size || DEFAULT_FONT_SIZE },
                BackgroundImageNormal: defalutNormalBrush,
                ForegroundColor: textColor,
                BackgroundColor: defaultTintBackColor,
                FocusedForegroundColor: textColor,
                BackgroundImageFocused: defalutHoverBrush,
                BackgroundImageHovered: defalutHoverBrush,
                Padding: { Top: 0, Bottom: 0 },
                // eslint-disable-next-line @typescript-eslint/naming-convention
                VScrollBarPadding: { Top: 0, Bottom: 0 },
            }, Slot: props.Slot || defalutSlot, 
            // ForegroundColor={formatColor(props.color || defaultTextColor)}
            OnTextCommitted: (text, methond) => {
                if (text !== props.Text) {
                    props.OnChange(text);
                }
            }, ToolTipText: props.Tip })));
}
exports.EditorBox = EditorBox;
// eslint-disable-next-line @typescript-eslint/naming-convention
function Check(props) {
    return (React.createElement(react_umg_1.CheckBox, { CheckedState: props.UnChecked ? ue_1.ECheckBoxState.Unchecked : ue_1.ECheckBoxState.Checked, OnCheckStateChanged: (checked) => {
            props.OnChecked(checked);
        }, ToolTipText: props.Tip }));
}
exports.Check = Check;
// eslint-disable-next-line @typescript-eslint/naming-convention
function Fold(props) {
    // eslint-disable-next-line no-nested-ternary
    const text = props.IsFold ? (props.IsFull ? '▶' : '▷') : props.IsFull ? '▼' : '▽';
    return (React.createElement(Btn, { Text: text, Slot: props.Slot, OnClick: () => {
            props.OnChanged(!props.IsFold);
        } }));
}
exports.Fold = Fold;
const defaultListTintBackColor = {
    SpecifiedColor: (0, Color_1.formatColor)(exports.DEFAULT_LIST_BACK_COLOR),
    ColorUseRule: ue_1.ESlateColorStylingMode.UseColor_Specified,
};
const defalutListNormalBrush = {
    TintColor: defaultListTintBackColor,
    OutlineSettings: defaultOutlineSetting,
};
const defaultListButtonStyle = {
    Normal: defalutListNormalBrush,
    Hovered: defalutHoverBrush,
    NormalPadding: defaultPadding,
    PressedPadding: defaultPadding,
};
const downArrowImage = {
    TintColor: defaultTintTextColor,
    ImageSize: { X: 9, Y: 9 },
    ImageType: ue_1.ESlateBrushImageType.NoImage,
    Tiling: ue_1.ESlateBrushTileType.NoTile,
};
const defaultListStyle = {
    ComboButtonStyle: {
        ButtonStyle: defaultListButtonStyle,
        DownArrowImage: downArrowImage,
    },
};
const defalutListRowStyle = {
    InactiveBrush: defalutNormalBrush,
    ActiveBrush: defalutNormalBrush,
    TextColor: defaultTintTextColor,
};
// eslint-disable-next-line @typescript-eslint/naming-convention
function List(props) {
    const arrayItems = (0, Common_1.toUeArray)(props.Items, ue_1.BuiltinString);
    return (React.createElement(react_umg_1.SizeBox, { bOverride_WidthOverride: !!props.Width, WidthOverride: props.Width },
        React.createElement(react_umg_1.ComboBoxString, { WidgetStyle: defaultListStyle, ForegroundColor: defaultTintTextColor, ItemStyle: defalutListRowStyle, Slot: props.Slot || defaultListSlot, ToolTipText: props.Tip, DefaultOptions: arrayItems, SelectedOption: props.Selected, Font: { Size: DEFAULT_LIST_FONT_SIZE }, ContentPadding: { Top: -1, Bottom: -1 }, HasDownArrow: !props.HideArrow, OnSelectionChanged: (item, si) => {
                if (item !== props.Selected && item) {
                    props.OnSelectChanged(item);
                }
            } })));
}
exports.List = List;
//# sourceMappingURL=CommonComponent.js.map